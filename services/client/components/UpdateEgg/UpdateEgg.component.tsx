import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Form } from "./UpdateEgg.styles";

// Query For fetch Egg by id
const GET_EGG = gql`
  query egg($id: ID!) {
    egg(where: { id: $id }) {
      id
      title
    }
  }
`;

// Mutation for UpdateEgg
const UPDATE_EGG_MUTATION = gql`
  mutation updateEgg($id: ID!, $title: String!) {
    updateEgg(id: $id, title: $title) {
      id
    }
  }
`;

// UpdateEgg Component

interface IUpdateEggProps {
  id: any;
}

const UpdateEgg: React.FunctionComponent<IUpdateEggProps> = props => {
  // Fetch data by id usinf Query Hook
  const { loading: fetching, error: fetchingError, data: fetchData } = useQuery(
    GET_EGG,
    {
      variables: { id: props.id }
    }
  );
  // UpdateEgg Mutation hook
  const [UpdateEgg, { loading, error }] = useMutation(UPDATE_EGG_MUTATION, {
    onCompleted: data => {
      console.log(data);
    }
  });

  // react form hook
  const { register, handleSubmit, errors } = useForm();

  // Handle On Form Submit
  const onSubmit = async (values, e) => {
    e.preventDefault();
    // console.log(values);
    // UpdateEgg Mutation call with data
    await UpdateEgg({ variables: { id: props.id, title: values.title } });
  };

  // rendering part
  // Fetching Egg Details
  if (fetching) return <p>Loading...</p>;
  // if any error in fetching Data
  if (fetchingError) return <p>Error: {fetchingError.message}</p>;
  // if any error in form submiting
  if (error) return <p>Error: {error.message}</p>;

  //else render form
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <fieldset disabled={loading}>
        <label htmlFor="title">
          Title
          <input
            defaultValue={fetchData.egg.title}
            type="text"
            id="title"
            name="title"
            placeholder="Title"
            ref={register({ required: true })}
          />
          {errors.title && "Your input is required"}
        </label>
        <br />
        <button type="submit">Update</button>
      </fieldset>
    </Form>
  );
};

export default UpdateEgg;
