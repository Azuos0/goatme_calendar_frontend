import gql from 'graphql-tag';

export const FETCH_ACTIVITIES = gql`
 query FETCH_ACTIVITIES(
  $interval: [String!]!
){
  activities(dateInterval: $interval){
    id_ref
    start
    end
    title
  }
}
`