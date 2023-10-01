local fs = require("@lune/fs")
local roblox = require("@lune/roblox")
local process = require("@lune/process")

local placePath = process.args[1]

local game = roblox.deserializePlace(fs.readFile(placePath))
local Workspace = game:GetService("Workspace")

for _, folder in Workspace:GetChildren() do
    if folder.ClassName == "Folder" then
        local modelContents = folder:GetChildren()
        if #modelContents == 0 then
            error("No model contents in " .. folder.Name .. "!")
        elseif #modelContents > 1 then
            error("Multiple roots in " .. folder.Name .. "!")
        end
        fs.writeFile(folder.Name, roblox.serializeModel(modelContents))
    end
end
