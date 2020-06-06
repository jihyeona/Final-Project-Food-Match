import React, { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { Form } from '../lib/form'
import { additem } from 'reducers/user'

export const AddItem = () => {
  const dispatch = useDispatch()

  const fileInput = useRef()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleItemSubmit = (e) => {
    e.preventDefault()
    //dispatch thunk
    dispatch(additem(name, description, fileInput))
  }

  return (
    <Form onSubmit={handleItemSubmit}>
      <label>
        Image
        <input type="file" ref={fileInput} />
      </label>

      <label>
        Name
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <label>
        Description
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </label>

      <button type="submit">
        Add item
      </button>
    </Form>
  )
}

export default AddItem