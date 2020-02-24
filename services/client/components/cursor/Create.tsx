import { useMutation } from "@apollo/react-hooks";
import React from "react";
import { useForm } from "react-hook-form";
import { CREATE_CURSOR_MUTATION } from "../../graphql/Mutation";
import { CURSORS_QUERY } from "../../graphql/Query";
import useAvailableCursors from "../../hooks/graphql/availableCursors";
import { Form } from "../styled";

// ##### COMPONENT PROPS TYPE #####
interface ICreateCursorProps {
  flavorname: string;
  flavorId: string;
}

// ##### COMPONENT #####
const CreateCursor: React.FunctionComponent<ICreateCursorProps> = props => {
  // ##### HOOKS #####

  // call Mutation for create Cursor
  const [createCursor, { loading, error }] = useMutation(
    CREATE_CURSOR_MUTATION,
    {
      refetchQueries: [
        {
          query: CURSORS_QUERY,
          variables: { flavorname: props.flavorname }
        }
      ]
    }
  );

  //fetch cursors for how much added
  const { fetching, availableCursors } = useAvailableCursors({
    flavorname: props.flavorname
  });

  // react form hook
  const { register, handleSubmit, errors } = useForm();

  // ##### HANDLING FUNCTION #####

  // Handle On Form Submit
  const onSubmit = async (values, e) => {
    e.preventDefault();
    // first convert frames to Integer Value
    values.frames = parseInt(values.frames, 10);

    // createCursor Mutation call with data
    await createCursor({
      variables: { ...values, flavorId: props.flavorId }
    });

    // Reset Form
    e.target.reset();
  };

  // ##### RENDER #####

  // if any error in form submiting
  if (error) return <p>Error: {error.message}</p>;
  if (fetching) return <p>Fetching Egg</p>;

  // No cursor for add is possible
  if (availableCursors.length === 0) {
    return <p>All Cursosrs satisfeid</p>;
  }

  // Render form
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <fieldset disabled={loading}>
        {/* Insert cursor name */}
        <label htmlFor="Cursor Name">
          Select Cursor <br />
          <select name="name" id="name" ref={register({ required: true })}>
            {availableCursors.map(cursor => (
              <option key={cursor} value={cursor}>
                {cursor}
              </option>
            ))}
          </select>
          {errors.name && "Cursor Type required"}
        </label>

        <br />

        {/* Insert cursor frames */}
        <label htmlFor="Cursor Frames">
          Frames <br />
          <input
            type="number"
            max="60"
            name="frames"
            id="frames"
            ref={register({ required: true })}
          />
          {errors.frames && "Frames is required "}
        </label>

        <br />

        {/* Submition */}
        <button type="submit">Add</button>
      </fieldset>
    </Form>
  );
};

export default CreateCursor;
