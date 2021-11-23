@echo off

echo Building <%= webclientname %>
pushd <%= webclientfoldername %>
call npm install
call ng lint
popd

echo Building <%= webapiname %>
pushd <%= webapifoldername %>
dotnet restore --interactive
popd

start cmd.exe /c "cd <%= webapifoldername %> && dotnet run -c Debug --launch-profile webapi"
start cmd.exe /c "cd <%= webclientfoldername %> && ng serve --ssl=true --open --port 4200 --configuration development"
