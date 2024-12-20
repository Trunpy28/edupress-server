# edupress-server

## Getting Started

### Prerequisites

Run the following command to install dependencies:

```shell
npm install
```

### Environment variables

This project depends on some environment variables.
If you are running this project locally, create a `.env` file at the root for these variables.
Your host provider should included a feature to set them there directly to avoid exposing them.

Here are the required ones:

```
PORT=
MONGODB_URI=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

MAIL_ACCOUNT=
MAIL_PASSWORD=

CLIENT_URL=

PAYPAL_API_BASE=
PAYPAL_CLIENT_ID=
PAYPAL_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

NODE_ENV=
```

### Run server
In the terminal, run the following command to start the server:
```shell
npm start
```