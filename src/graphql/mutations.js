import gql from 'graphql-tag';

export const ADD_ACTIVITY = gql`
mutation ADD_ACTIVITY(
  $name: String!
  $description: String
  $start_time: String!
  $end_time: String!
  $start_date: DateTime!
  $end_date: DateTime!
  $weekday: Int!
){
  addActivity(activity: {
    name: $name,
    description: $description,
    start_time: $start_time,
    end_time: $end_time,
    start_date: $start_date,
    end_date: $end_date,
    weekday: $weekday
  }){
    id
    name
    description
  }
}
`