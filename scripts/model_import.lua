-- luacheck: globals remodel Instance

local game = Instance.new("DataModel")
local Workspace = game:GetService("Workspace")

local args = { ... }
local placePath = table.remove(args, 1)

for _, modelPath in pairs(args) do
    local folder = Instance.new("Folder")
    folder.Name = modelPath
    folder.Parent = Workspace
    for _, instance in pairs(remodel.readModelFile(modelPath)) do
        instance.Parent = folder
    end
end

remodel.writePlaceFile(game, placePath)
