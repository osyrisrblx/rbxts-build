-- luacheck: globals Instance

local fs = require("@lune/fs")
local roblox = require("@lune/roblox")
local process = require("@lune/process")

local Instance = roblox.Instance

local game = Instance.new("DataModel")
local Workspace = game:GetService("Workspace")

local args = table.clone(process.args)
local placePath = table.remove(args, 1)

for _, modelPath in args do
    local folder = Instance.new("Folder")
    folder.Name = modelPath
    folder.Parent = Workspace
    for _, instance in roblox.deserializeModel(fs.readFile(modelPath)) do
        instance.Parent = folder
    end
end

fs.writeFile(placePath, roblox.serializePlace(game))
