import { openDb } from 'idb'

const dbPromise = _ => {
  if (!('indexedDB' in window)) {
    throw new Error('Browser does not support IndexedDB')
  }

  return openDb('VueQuizDB', 1, upgradeDb => {
    if (!upgradeDb.objectStoreNames.contains('courses_data')) {
      upgradeDb.createObjectStore('courses_data')
    }

    if (!upgradeDb.objectStoreNames.contains('questions_paper')) {
      upgradeDb.createObjectStore('questions_paper')
    }
  })
}

const checkStorage = async storeName => {
  return dbPromise()
    .then(db => {
      const tx = db.transaction(storeName, 'readonly')
      const store = tx.objectStore(storeName)

      return store.get(storeName)
    })
    .catch(error => {
      return error
    })
}

const saveToStorage = async (storeName, tasks) => {
  return dbPromise()
    .then(db => {
      const tx = db.transaction(storeName, 'readwrite')
      const store = tx.objectStore(storeName)

      store.put(tasks, storeName)

      return tx.complete
    })
    .catch(error => {
      return error
    })
}

export default {
  checkStorage,
  saveToStorage,
  dbPromise
}
