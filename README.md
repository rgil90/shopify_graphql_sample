### Getting Started

To get started with this project, you'll need the following software:

- Docker

All of software tools you need to run the application should be bundled in
the docker image included in this project. 

1. Clone this repository
2. Make a copy of the `env.sample` file and rename it to `.env` .
3. Fill in the blanks with the credentials, as the docker container requires those environment variables to run the script.
4. Run `docker build -t <replace_with_your_tag_name_here> .`
5. Run `docker run --env-file=.env <replace_with_your_tage_name_here> npm run start "<insert_keyword_here>"`


### Example

Assume we want to build the project first

`docker build -t shopify_graphql_api .`

Then we want to search for a product with the term 'shirt':

`docker run --env-file=.env shopify_graphql_api npm run start "shirt"`
