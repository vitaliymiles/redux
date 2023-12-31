import { createAction, createSlice } from '@reduxjs/toolkit'
import todosService from '../services/todos.service'
import { setError } from './errors'
const initialState = { entities: [], isLoading: true }

const taskSlice = createSlice({
  name: 'tasc',
  initialState,
  reducers: {
    recived(state, action) {
      state.entities = action.payload
      state.isLoading = false
    },
    update(state, action) {
      const elementIndex = state.entities.findIndex(
        (el) => el.id === action.payload.id
      )
      state.entities[elementIndex] = {
        ...state.entities[elementIndex],
        ...action.payload,
      }
    },
    remove(state, action) {
      state.entities = state.entities.filter(
        (el) => el.id !== action.payload.id
      )
    },
    loadTaskRequested(state) {
      state.isLoading = true
    },

    taskRequestedFailed(state) {
      state.isLoading = false
    },
    taskAdded(state, action) {
      state.entities.push(action.payload)
    },
  },
})
const { actions, reducer: tascReducer } = taskSlice
const {
  update,
  remove,
  recived,
  taskRequestedFailed,
  taskAdded,
  loadTaskRequested,
} = actions

const taskRequested = createAction('task/taskRequested')

export const loadTasks = () => async (dispatch) => {
  dispatch(loadTaskRequested())
  try {
    const data = await todosService.fetch()
    dispatch(recived(data))
  } catch (error) {
    dispatch(taskRequestedFailed())
    dispatch(setError(error.message))
  }
}
export const createTask = (tasc) => async (dispatch) => {
  dispatch(taskRequested())
  try {
    const data = await todosService.create(tasc)
    dispatch(taskAdded(data))
  } catch (error) {
    dispatch(taskRequestedFailed())
    dispatch(setError(error.message))
  }
}
export const completeTask = (id) => (dispatch, getState) => {
  dispatch(update({ id, completed: true }))
}

export const titleChenge = (id) => {
  return update({ id, title: `Новое значение ${id}` })
}

export const taskDelete = (id) => {
  return remove({ id })
}

export const getTasks = () => (state) => state.tasks.entities
export const getTasksLoadingStatus = () => (state) => state.tasks.isLoading

export default tascReducer
