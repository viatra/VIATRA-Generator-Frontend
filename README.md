# VIATRA-Generator-Frontend

## DEV

#### How to run the project
Calling `npm start` in the project directory will 
run the project on port 3000.

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
