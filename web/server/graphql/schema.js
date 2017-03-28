import { makeExecutableSchema } from 'graphql-tools'
import { Customers, Orders } from '../mongodb/connectors'

const schema = `
    type Customer {
    entity_id: ID!
    email: String
    firstname: String
    lastname: String
    orders: [Order]
    }

    type Order {
    entity_id: ID!
    base_grand_total: Float
    customer: Customer
    }

    type Catalog {
    entity_id: ID!
    name: String
    }

    type Category {
    entity_id: ID!
    name: String
    catalog: Catalog
    }

    type Product {
    entity_id: ID!
    name: String
    enabled: Boolean!
    category: Category
    }

    # the schema allows the following query:
    type Query {
    orders: [Order]
    customers: [Customer]
    products: [Product]
    }

    schema {
    query: Query
    }
`

const resolvers = {
    Query: {
        orders() {
            return Orders.then(res => res.find({}).toArray())
        },
        customers() {
            return Customers.then(res => res.find({}).toArray())
        },
        products() {
            return Products.then(res => res.find({}))
        }
    },
    Customer: {
        orders(customer) {
            return Orders.then(res => res.find({ customer: customer.email }).toArray())
        }
    },
    Order: {
        customer(order) {
            return Customers.then(res => res.findOne({ email: order.customer }))
        }
    }
}

export default makeExecutableSchema({ typeDefs: [schema], resolvers })