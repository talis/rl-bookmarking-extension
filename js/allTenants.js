/**
 * Use this to populate the list of institutions in the options menu.  In order for a tenant to
 * appear, it *must* have an `apps.rl` value (which can be anything)
 *
 * The non-branded 'Talis' extension should use the tenant list from:
 * https://talis-public.s3-eu-west-1.amazonaws.com/talis.com/customers.json
 */
export const allTenants = {
    "broadminster" : {
        "name" : "Broadminster University",
        "apps" : {
            "rl" : true
        },
        "region" : "EUAPAC"
    },
    "broadminster_old" : {
        "name" : "Old Broadminster University",
        "apps" : {
            "rl" : true
        },
        "region" : "EUAPAC"
    },
    "cst" : {
        "name" : "CST | Talis Training",
        "apps" : {
            "rl" : true
        },
        "region" : "EUAPAC"
    },
    "testfour" : {
        "name" : "Test Four | Talis Testing",
        "apps" : {
            "rl" : true
        },
        "region" : "CA"
    }
};
