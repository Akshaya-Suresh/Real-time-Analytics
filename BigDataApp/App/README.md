# UserRegis
## Prerequisites
Go to the terminal
```
> sudo dnf install nodejs
```
Nodejs will be installed

## Build and Deploy instructions for Web Application
1) Import the project in the Visual studio code 
2) Open the terminal in visual studio and type npm install
This will install all the dependencies mentioned in package.json
3) In launch.json type the following code
```
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "program": "${workspaceFolder}//server.js"
        }
    ]
}
```
4) Now Debug -> Start Debugging
5) The server started with port 4501
## Running the unit test
In Visual studio terminal type 
```
npm test
```
This runs all the test cases

<b>Note:</b> Make sure the server is started while running Junit test case
