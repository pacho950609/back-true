# Serverless

## Getting Started

First, install the project dependence:

```bash
npm i
```

Second, run the development server:

```bash
npm run start:dev
```

Now you can use the different services in the following path `localhost:3000`, it is important to know that this project it's connected to a local Postgres DB named `potter`, so you must have it in your local machine or change the DB name and credentials in the `/resources/config/env.yml` file.

Here's an example

Get the token with the sign up service

URL
```bash
localhost:3000/signup
```
BODY
```bash
{
	"email": "pacho1@yopmail.com",
	"password": "pacho123"
}
```

Then, use that token in the Authorization header to create an operation

URL
```bash
localhost:3000//v1/addition
```
BODY
```bash
{
    "number1": 10,
    "number2": 2
}
```

Finally, search for client records

URL
```bash
localhost:3000/v1/records-number?recordsPerPage=6&orderByCol=type
```

## Test

To run test you only have to run the following command

```bash
npm run test
```

It is important to know that tests are connected to a local Postgres DB named `potter-test`, so you must have it in your local machine or change the DB name and credentials in the `.test.env` file.


## Deploy

This is a serverless project, if you want to deploy it in your AWS account you only have to run the following command

```bash
npm run deploy
```

To run this command you must configure your aws credentials in the `~/.aws` folder