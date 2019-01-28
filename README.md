# VIATRA-Generator-Frontend

## How to run the project

Calling `npm start` in the project directory will 
run the project on port 8000.

If you wish to run the project on a separate port, add the following
lines to `package.json`:

(Linux / Mac)
```
"scripts": {
    "start": "PORT=<PORT_NUMBER> react-scripts start",
     ...
 }
```

Windows
```
"scripts": {
    "start": "set PORT=<PORT_NUMBER>&& react-scripts start",
     ...
 }
 ```


 ## Backend & MongoDB
 This project uses MongoDB in order to store data for the service. In order to run the
 service, the machine needs to have mongoDB installed locally and running:

 ```
// macOS
> brew update
> brew install mongodb
> sudo mkdir -p /data/db
> sudo chown -R `id -un` /data/db
> mongod
 ```
 This will run an instance of mongo on the machine and the backend will now be able to connect to the machine.
