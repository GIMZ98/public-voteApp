import { createSlice } from '@reduxjs/toolkit'

const initialState = 0

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers:{
        setAddress: (state, action) => {
            return action.payload.address;
        }
    }
})

export const { setAddress } = addressSlice.actions
export const selectAddress = state => state.address

export default addressSlice.reducer