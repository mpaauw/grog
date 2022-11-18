  set -m

    /entrypoint.sh couchbase-server &

    sleep ${COUCHBASE_INIT_DELAY_SECONDS}

    # Setup initial cluster/ Initialize Node
    couchbase-cli cluster-init -c 127.0.0.1 --cluster-name grog_cluster --cluster-username ${COUCHBASE_ADMINISTRATOR_USERNAME} \
    --cluster-password ${COUCHBASE_ADMINISTRATOR_PASSWORD} --services data,index,query,fts --cluster-ramsize 256 --cluster-index-ramsize 256 \
    --cluster-fts-ramsize 256 --index-storage-setting default \

    # Setup Administrator username and password
    curl -v http://127.0.0.1:8091/settings/web -d port=8091 -d username=${COUCHBASE_ADMINISTRATOR_USERNAME} -d password=${COUCHBASE_ADMINISTRATOR_PASSWORD}

    # Setup Bucket
    couchbase-cli bucket-create -c 127.0.0.1:8091 --username ${COUCHBASE_ADMINISTRATOR_USERNAME} \
    --password ${COUCHBASE_ADMINISTRATOR_PASSWORD} --bucket default --bucket-type couchbase \
    --bucket-ramsize 256

    # Setup RBAC user using CLI
    couchbase-cli user-manage -c 127.0.0.1:8091 --username ${COUCHBASE_ADMINISTRATOR_USERNAME} --password ${COUCHBASE_ADMINISTRATOR_PASSWORD} \
    --set --rbac-username ${COUCHBASE_ADMINISTRATOR_USERNAME}-rbac --rbac-password ${COUCHBASE_ADMINISTRATOR_PASSWORD}_rbac --rbac-name rbac \
        --roles bucket_full_access[*],bucket_admin[*] --auth-domain local

    sleep 5

    # Create default index
    /opt/couchbase/bin/cbq -u ${COUCHBASE_ADMINISTRATOR_USERNAME} -p ${COUCHBASE_ADMINISTRATOR_PASSWORD} --script="CREATE PRIMARY INDEX \`default\` ON default USING GSI"

    fg