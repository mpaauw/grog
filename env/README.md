Please note that the environment defaults listed below are ideal for using Docker. If you do not plan to use the default Docker configuration within Grog, feel free to reconfigure each variable to it's appropriate value based on your specific setup.

| Variable Name | Description | Recommended Default Value |  Required |
| ----------- | ----------- | ----------- | ----------- |
| ENVIRONMENT | The environment where Grog is running; i.e., 'local', 'staging', 'production', etc. |  `local` | No |
| LOG_LEVEL | Default log severity level to use.  | `debug` | No |
| INIT_MAX_NUMBER_OF_RETRIES | Maximum number of retry attempts to execute during dependency startup (i.e., Couchbase, Redis, etc).  | `10` | Yes |
| INIT_RETRY_BACKOFF_INTERVAL_MILLISECONDS | Interval in milliseconds to use between retry attempts when attempting to initialize a dependency during startup.  | `1000` | Yes |
| API_SERVER_PORT | The port where the Grog HTTP API will run.  | `3000` | Yes |
| REDIS_DEFAULT_TTL_SECONDS | The default [TTL](https://en.wikipedia.org/wiki/Time_to_live) in seconds used for Redis cache entries.  | `3600` | Yes |
| REDIS_URL | URL of the running Redis instance.  | `redis://redis:6379` | Yes |
| COUCHBASE_INIT_DELAY_SECONDS | Delay in seconds used to pause database-related dependencies to account for Couchbase startup latency.  | `15` | Yes |
| COUCHBASE_URL | URL of the running Couchbase instance.  | `http://couchbase:8091` | Yes |
| COUCHBASE_BUCKET_NAME | Name of the default Couchbase bucket for Grog to use.  | `default` | Yes |
| COUCHBASE_ADMINISTRATOR_USERNAME | Username of the Couchbase account for Grog to use.  | `Administrator` | Yes |
| COUCHBASE_ADMINISTRATOR_PASSWORD | Password of the Couchbase account for Grog to use.  | `password` | Yes |