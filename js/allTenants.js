/**
 * Use this to populate the list of institutions in the options menu.  In order for a tenant to 
 * appear, it *must* have an `apps.rl` value (which can be anything)
 * 
 * The non-branded 'Talis' extension should use the tenant list from:
 * https://talis-public.s3-eu-west-1.amazonaws.com/talis.com/customers.json
 */
var allTenants = {
    "broadminster" : {
        "name" : "Broadminster University",
        "apps" : { 
            "rl" : true
        }
    },
    "broadminster_old" : { 
        "name" : "Old Broadminster University",
        "apps" : {
            "rl" : true
        }
    },
    "cst" : {
        "name" : "CST | Talis Training",
        "apps" : {
            "rl" : true
        }
    }
};