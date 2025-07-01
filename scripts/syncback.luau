--[[
	Syncback script for rbxts-build
	Continuous monitoring for syncback functionality
]]

local process = require("@lune/process")
local fs = require("@lune/fs")
local task = require("@lune/task")

local mode = process.args[1] or "single"
local placeFile = process.args[2] or "game.rbxl"
local projectFile = process.args[3] or "default.project.json"

if mode == "single" then
	-- Single syncback operation
	print("Running syncback...")
	local result = process.create("rojo", { "syncback", "--input", placeFile, "--non-interactive", projectFile })

	if result.ok then
		print("Syncback completed successfully")
	else
		print("Syncback failed (exit code: " .. tostring(result.code) .. ")")
		process.exit(1)
	end
elseif mode == "watch" then
	-- Continuous monitoring implementation
	print("Starting continuous syncback monitoring...")
	print("Press Ctrl+C to stop monitoring")

	local lastModified = 0

	-- Check if place file exists
	if not fs.isFile(placeFile) then
		print("Error: Place file " .. placeFile .. " not found")
		process.exit(1)
	end

	while true do
		local metadata = fs.metadata(placeFile)
		if metadata.modifiedAt and metadata.modifiedAt.unixTimestampMillis > lastModified then
			lastModified = metadata.modifiedAt.unixTimestampMillis

			print(placeFile .. " changed. Running syncback...")

			local result = process.exec("rojo", { "syncback", "--input", placeFile, "--non-interactive", projectFile })

			if result.ok then
				print("  syncback succeeded")
			else
				print("  syncback failed (exit code: " .. tostring(result.code) .. ")")
			end
		end

		task.wait(1) -- Check every second
	end
else
	print("Usage: lune run syncback.luau [single|watch] [place_file] [project_file]")
	print("  single: Run syncback once (default)")
	print("  watch: Monitor for changes and run syncback continuously")
	process.exit(1)
end
