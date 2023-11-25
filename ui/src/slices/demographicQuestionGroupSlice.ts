import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../api';
import { RootState } from '../app/store';
import { DemographicQuestionGroup } from '../interfaces/question.interface';
import { defaultAPIErrorHandle, defaultAPISuccessHandle } from '../util/error-util';

export interface DemographicQuestionGroupState {
  status: 'idle' | 'loading' | 'failed';
  questionGroups: DemographicQuestionGroup[];
  selected?: DemographicQuestionGroup;
  openDialog: boolean;
}

const initialState: DemographicQuestionGroupState = {
  status: 'idle',
  questionGroups: [],
  selected: undefined,
  openDialog: false,
};

export const loadDemographicQuestionGroupsAsync = createAsyncThunk(
  'demographicQuestionGroup/loadDemographicQuestionGroups',
  async (_, { dispatch }) => {
    try {
      return await api.getDemographicQuestionGroups();
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const filterDemographicQuestionGroupsByParamsAsync = createAsyncThunk(
  'demographicQuestionGroup/filterDemographicQuestionGroupsByParamsAsync',
  async (params: { datasetId?: number }, { dispatch }) => {
    try {
      return await api.getDemographicQuestionGroups(params);
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const createDemographicQuestionGroupAsync = createAsyncThunk(
  'demographicQuestionGroup/createDemographicQuestionGroup',
  async (questionGroup: DemographicQuestionGroup, { dispatch }) => {
    try {
      await api.createDemographicQuestionGroup(questionGroup);
      defaultAPISuccessHandle(`Created question group '${questionGroup.title}' successfully`, dispatch);
      dispatch(loadDemographicQuestionGroupsAsync());
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const updateDemographicQuestionGroupAsync = createAsyncThunk(
  'demographicQuestionGroup/updateDemographicQuestionGroup',
  async ({ groupId, group }: { groupId: number, group: DemographicQuestionGroup }, { dispatch }) => {
    try {
      await api.updateDemographicQuestionGroup(groupId, group);
      defaultAPISuccessHandle(`Updated question group '${group.title}' successfully`, dispatch);
      dispatch(loadDemographicQuestionGroupsAsync());
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const deleteDemographicQuestionGroupAsync = createAsyncThunk(
  'demographicQuestionGroup/deleteDemographicQuestionGroup',
  async (groupId: number, { dispatch }) => {
    try {
      await api.deleteDemographicQuestionGroup(groupId);
      defaultAPISuccessHandle(`Delete question group ID '${groupId}' successfully`, dispatch);
      dispatch(loadDemographicQuestionGroupsAsync());
    } catch (error: any) {
      defaultAPIErrorHandle(error, dispatch);
      throw error;
    }
  }
);

export const demographicQuestionGroupSlice = createSlice({
  name: 'demographicQuestionGroup',
  initialState,
  reducers: {
    setSelected: (state, action) => {
      state.selected = action.payload;
    },

    setOpenDialog: (state, action) => {
      state.openDialog = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loadDemographicQuestionGroupsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadDemographicQuestionGroupsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.questionGroups = action.payload;
      })
      .addCase(loadDemographicQuestionGroupsAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(filterDemographicQuestionGroupsByParamsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(filterDemographicQuestionGroupsByParamsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.questionGroups = action.payload;
      })
      .addCase(filterDemographicQuestionGroupsByParamsAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(createDemographicQuestionGroupAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createDemographicQuestionGroupAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.openDialog = false;
      })
      .addCase(createDemographicQuestionGroupAsync.rejected, (state) => {
        state.status = 'failed';
      })

      .addCase(updateDemographicQuestionGroupAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateDemographicQuestionGroupAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.selected = undefined;
        state.openDialog = false;
      })
      .addCase(updateDemographicQuestionGroupAsync.rejected, (state) => {
        state.status = 'failed';
        state.selected = undefined;
      })

      .addCase(deleteDemographicQuestionGroupAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteDemographicQuestionGroupAsync.fulfilled, (state, action) => {
        state.status = 'idle';
      })
      .addCase(deleteDemographicQuestionGroupAsync.rejected, (state) => {
        state.status = 'failed';
      })
      ;
  },
});

export const {
  setSelected,
  setOpenDialog,
} = demographicQuestionGroupSlice.actions;

export const selectDemographicQuestionGroupState = (state: RootState) => state.demographicQuestionGroup;

export default demographicQuestionGroupSlice.reducer;
