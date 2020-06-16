import React, { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ProfileDiv, Input, Form } from '../lib/form'
import { ListContainer, Column } from '../lib/container'
import { Button } from '../lib/button'
import { additem } from 'reducers/user'
import { useParams, useHistory } from 'react-router-dom'
import { AddPollLottie } from '../components/AddPollLottie'
import NavbarLight from '../components/NavBar'
import { PollText } from '../lib/container'

export const AddItem = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const fileInput = useRef()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const { pollId } = useParams()
  const userId = useSelector((store) => store.user.login.userId)

  const handleItemSubmit = (e) => {
    e.preventDefault()
    //dispatch thunk
    dispatch(additem(name, description, fileInput, pollId, userId))
    setName('')
    setDescription('')
    history.push(`/polls/${pollId}`)
  }

  return (
    <ListContainer>
      <NavbarLight />
      <AddPollLottie />
      <Form onSubmit={handleItemSubmit}>
        <PollText>Add your item.</PollText>
        <Input type="text" value={name} onChange={(e) => setName(e.target.value)}
          placeholder='Name' />
        <Input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
          placeholder='Description' />

        <label>
          <input type="file" ref={fileInput} />
        </label>

        <Button type="submit">
          Add item
      </Button>
      </Form>
    </ListContainer>
  )
}

export default AddItem