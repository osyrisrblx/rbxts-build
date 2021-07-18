-- luacheck: globals remodel Instance

local placePath = ...
local game = remodel.readPlaceFile(placePath)
local Workspace = game:GetService("Workspace")

for _, folder in pairs(Workspace:GetChildren()) do
    if folder.ClassName == "Folder" then
        local modelContents = folder:GetChildren()
        if #modelContents == 0 then
            error("No model contents in " .. folder.Name .. "!")
        elseif #modelContents > 1 then
            error("Multiple roots in " .. folder.Name .. "!")
        end
        remodel.writeModelFile(modelContents[1], folder.Name)
    end
end
