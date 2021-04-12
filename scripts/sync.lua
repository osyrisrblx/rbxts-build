-- luacheck: globals remodel

local placeFilePath, outPath = ...

local game = remodel.readPlaceFile(placeFilePath)

local SERVICE_BLACKLIST = {
	StarterPlayer = true,
}

local output = ""
local indent = ""

local function pushIndent()
	indent = indent .. "\t"
end

local function popIndent()
	indent = string.sub(indent, 2)
end

local function writeLine(str)
	if str == "" then
		output = output .. "\n"
	else
		output = output .. indent .. str .. "\n"
	end
end

local function writeService(service)
	local serviceChildren = service:GetChildren()

	if next(serviceChildren) == nil then
		return
	end

	writeLine("interface " .. service.ClassName .. " {")
	pushIndent()

	local function search(instance)
		local name = instance.Name
		if name == "node_modules" then
			return
		end
		if not string.match(name, "^[_a-zA-Z][_a-zA-Z0-9]*$") then
			name = '"' .. name .. '"'
		end
		local definition = name .. ": " .. instance.ClassName
		local children = instance:GetChildren()
		if next(children) == nil then
			writeLine(definition .. ";")
		else
			writeLine(definition .. " & {")
			pushIndent()
			local seen = {}
			for _, child in ipairs(children) do
				if not seen[child.Name] then
					seen[child.Name] = true
					search(child)
				end
			end
			popIndent()
			writeLine("};")
		end
	end
	for _, child in ipairs(serviceChildren) do
		search(child)
	end

	popIndent()
	writeLine("}")
	writeLine("")
end

for _, service in ipairs(game:GetChildren()) do
	if not SERVICE_BLACKLIST[service.Name] then
		writeService(service)
	end
end

remodel.writeFile(outPath, string.match(output, "^(.-)%s*$") .. "\n")
