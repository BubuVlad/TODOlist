// import { FileItem, FilesList } from '@/src/components/interfaces/interfaces';
// import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
// import uuidv4 from '../../plugins/utils';

// @Module({ namespaced: true, name: 'FileList' })
// class FileList extends VuexModule {

//   public listsOfFiles: FilesList[] = []

//   @Mutation
//   public addNewList(newList: FilesList): void {
//    this.listsOfFiles.push(newList)
//   }

//   @Mutation
//   public addNewFileToList(newFile: FileItem) {
//     const listIdentifier = this.listsOfFiles.findIndex((el:FilesList) => el.nameOfList === newFile.listNameOfItem)
//     this.listsOfFiles[listIdentifier].filesList.push(newFile)
//   }

//   @Action
//   public createNewList( newList: FilesList):void {
//     this.context.commit('addNewList', newList);
//   }

//   @Action
//   public async addFileToListAction(newFile: FileItem):Promise<void> {
//     const listIdentifier = this.listsOfFiles.findIndex((el:FilesList) => el.nameOfList === newFile.listNameOfItem)
//     if (!this.listsOfFiles[listIdentifier]) {
//       await this.context.commit('addNewList', {
//         id: uuidv4(),
//         nameOfList: newFile.listNameOfItem,
//         filesList: []});
//     }
//     this.context.commit('addNewFileToList', newFile)
//   }
// }

// export default FileList