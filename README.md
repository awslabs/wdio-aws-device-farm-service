## AWS Device Farm Service for WebdriverIO 

[AWS Device Farm](https://aws.amazon.com/device-farm/) service for WebdriverIO.

## Installation

```
npm install --save-dev wdio-aws-device-farm-service
```

## Example

You can run the provided example with `npm run example`. It requires:

1. An AWS Device Farm project ARN as an environment variable `PROJECT_ARN`
2. AWS Credentials ([see docs](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html)). Note that AWS Device Farm only supports `us-west-2`. You can force an AWS region with the `AWS_REGION` environment variable.

For example, this is how it would look like using AWS temporary credentials:

```sh
export PROJECT_ARN="<your project arn>"
export AWS_ACCESS_KEY_ID="<aws access key id>"
export AWS_SECRET_ACCESS_KEY="<aws secret access key>"
export AWS_SESSION_TOKEN="<aws session token>"
export AWS_REGION="us-west-2"

npm run example
```

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This project is licensed under the Apache-2.0 License.
