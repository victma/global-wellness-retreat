# Global Wellness Retreat

## Project setup

```sh
npm i
npm run start
```

The API is then available at http://localhost:3000

### Tests

Run unit tests :

```sh
npm run test
```

Run end-to-end tests :

```sh
npm run test:e2e
```

## Authentication

Generate a new API key with the `/auth/new-key` endpoint. See details [in the Endpoints section below](#generate-a-new-api-key).

To call authenticated endpoints, you must include the 2 following headers to your request:

```
X-GWR-Key: <your private API key>
X-GWR-Id: <the associated partner id>
```

## Endpoints

### Generate a new API key

> [!NOTE]
> This is a helper endpoint. It was not designed as an actual way to generate a new key for a partner in a production scenario. That is why it does not require any authentication, does not validate incoming data, and is not covered by tests. See [Security > Improvements](#improvements) for more details on what the production implementation should be.

| Method | Route         |
| ------ | ------------- |
| POST   | /auth/new-key |

| Parameter | Description                                                                       |
| --------- | --------------------------------------------------------------------------------- |
| partnerId | A string to identify the partner account associated with the newly generated key. |

#### Request body example (JSON)

```json
{
  "partnerId": "test-id"
}
```

#### Response body example

```
lOQFlz/7k21Aph+dtqWtXKlKap+UfXW4a5m0JoThd1JisFVQWgv0BPFpFmF5GJoG
```

> :warning: Save this key as there is no way to see it again.

### Transmit client data

> [!NOTE]
> This is the main endpoint of the project receiving client data from GWR partners

| Method | Route    |
| ------ | -------- |
| POST   | /booking |

| Parameter            | Description                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| email                | Client email. Must be a valid email address                                                                               |
| language             | Client language. Must be a valid locale                                                                                   |
| countryOfOrigin      | Client origin. Must be a valid [ISO-3166-1 2 letters country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2)      |
| countryOfDestination | Client destination. Must be a valid [ISO-3166-1 2 letters country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) |
| travelDateStart      | Travel start date. Must be a valid [ISO-8601 date](https://en.wikipedia.org/wiki/ISO_8601)                                |
| travelDateEnd        | Travel end date. Must be a valid [ISO-8601 date](https://en.wikipedia.org/wiki/ISO_8601)                                  |

#### Request body example (JSON)

```json
{
  "email": "test@mail.com",
  "language": "fr",
  "countryOfOrigin": "us",
  "countryOfDestination": "nz",
  "travelDateStart": "2023-12-22",
  "travelDateEnd": "2024-01-22"
}
```

## Technical choices and possible improvements

### Security

#### Current implementation

To authenticate, GWR partners must use a secret API key on every request. The advantages of this solution are:

- it is the simplest option to implement on the client side
- several API keys can be associated with the same partner. This is useful to grant different authorization scopes, and to rotate keys without down time.
- the keys can be easily revoked

The main drawback is that it can put a lot of pressure on the database and add latency if the traffic is important as a query is added for each request.

The scenario does not imply particularly high traffic, so this solution seems acceptable. Moreover, the latency can be minimized with the following improvements.

#### Improvements

To reduce the load on the database and the latency, we could :

- cache key hashes in memory, as close to the client as possible to reduce the number of calls to the database
- add a checksum at the of the key (eg. `<private-key>_<checksum>`) to reject malformed keys without the need for a database query

Another improvement would be to combine the id and key to give only one key to clients. This would make implementation even easier for them. We need to keep the id though, as the keys are hashed with a salt. Without the id, checking the validity of a key would imply going through the whole table of key hashes one by one which is not acceptable is terms of latency.

Lastly, this implementation only focuses on the requests authentication, not on API keys management. In a production scenario, we would have partner accounts associated to a randomly generated id, expiration dates on keys, etc.

#### Alternate implementation

Another implementation I considered was to have a dedicated Auth endpoint to generate short-lived bearer tokens used to authenticate subsequent requests.

This implementation would greatly reduce the load of the database in the case of a high frequency of request from partners (several requests in the time-to-live of a token).

The main drawbacks of this implementation are that :

- it is a more complicated flow for partners to implement
- it is more difficult to quickly revoke the tokens

I considered we were in a low frequency scenario, hence I favored the first solution.

### Database

The data we need to persist is well structured and there is no other specific constraint so a relational database is the best choice in my opinion.

To simplify the setup of the project, I chose SQLite which requires virtually no setup and is very light. For a real production project with no specific constraint, the first choice would have certainly been a system with more features, like PostgreSQL.

### Schema

The `/booking` endpoint mostly validates the format of the parameters. It would make sense to add more business logic validation.

For example, the `language` parameter must be any locale. In real life, there would probably be a few supported languages only.
