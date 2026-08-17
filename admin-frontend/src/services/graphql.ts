// import { gql } from "@apollo/client";
// import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

// const httpLink = createHttpLink({
//   uri: "http://localhost:3001/graphql",
// });

// export const client = new ApolloClient({
//   link: httpLink,
//   cache: new InMemoryCache(),
// });

// export const GET_PROFILES = gql`
//   query GetProfiles {
//     profiles {
//       profile_id
//       email
//       first_name
//       last_name
//       mobile
//       street
//       city
//       state
//       postcode
//       pets {
//         pet_id
//         name
//       }
//     }
//   }
// `;

// export const GET_PROFILE = gql`
//   query GetProfile($id: ID!) {
//     profile(id: $id) {
//       profile_id
//       email
//       first_name
//       last_name
//       mobile
//       street
//       city
//       state
//       postcode
//       pets {
//         pet_id
//         name
//       }
//     }
//   }
// `;

// export const GET_PETS = gql`
//   query GetPets {
//     pets {
//       pet_id
//       name
//       profiles {
//         profile_id
//         first_name
//         last_name
//       }
//     }
//   }
// `;

// export const CREATE_PROFILE = gql`
//   mutation CreateProfile(
//     $email: String!
//     $first_name: String!
//     $last_name: String!
//     $mobile: String
//     $street: String
//     $city: String
//     $state: String
//     $postcode: String
//   ) {
//     createProfile(
//       email: $email
//       first_name: $first_name
//       last_name: $last_name
//       mobile: $mobile
//       street: $street
//       city: $city
//       state: $state
//       postcode: $postcode
//     ) {
//       profile_id
//       email
//       first_name
//       last_name
//     }
//   }
// `;

// export const UPDATE_PROFILE = gql`
//   mutation UpdateProfile(
//     $id: ID!
//     $email: String
//     $first_name: String
//     $last_name: String
//     $mobile: String
//     $street: String
//     $city: String
//     $state: String
//     $postcode: String
//   ) {
//     updateProfile(
//       id: $id
//       email: $email
//       first_name: $first_name
//       last_name: $last_name
//       mobile: $mobile
//       street: $street
//       city: $city
//       state: $state
//       postcode: $postcode
//     ) {
//       profile_id
//       email
//       first_name
//       last_name
//     }
//   }
// `;

// export const DELETE_PROFILE = gql`
//   mutation DeleteProfile($id: ID!) {
//     deleteProfile(id: $id)
//   }
// `;

// export const CREATE_PET = gql`
//   mutation CreatePet($name: String!) {
//     createPet(name: $name) {
//       pet_id
//       name
//     }
//   }
// `;

// export const UPDATE_PET = gql`
//   mutation UpdatePet($id: ID!, $name: String!) {
//     updatePet(id: $id, name: $name) {
//       pet_id
//       name
//     }
//   }
// `;

// export const DELETE_PET = gql`
//   mutation DeletePet($id: ID!) {
//     deletePet(id: $id)
//   }
// `;

// export const ADD_PET_TO_PROFILE = gql`
//   mutation AddPetToProfile($profileId: ID!, $petId: ID!) {
//     addPetToProfile(profileId: $profileId, petId: $petId) {
//       profile_id
//       pets {
//         pet_id
//         name
//       }
//     }
//   }
// `;

// export const REMOVE_PET_FROM_PROFILE = gql`
//   mutation RemovePetFromProfile($profileId: ID!, $petId: ID!) {
//     removePetFromProfile(profileId: $profileId, petId: $petId) {
//       profile_id
//       pets {
//         pet_id
//         name
//       }
//     }
//   }
// `;
