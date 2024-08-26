import { Account, Client,Avatars, Databases, Query, Storage, ID} from 'react-native-appwrite';

export const appWriteConfig = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.SilentZone.SilentZone',
  projectId: '66b9665a002d9f6fc08d',
  databaseId: '66bacf75000b36a89ab9',
  userCollectionId: '66bacf930021faf70649',
  zonesCollectionId: '66bacfd700339fa8f74c',
  storageId:'66bad16b00135fcd3b93'
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appWriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appWriteConfig.projectId) // Your project ID
    .setPlatform(appWriteConfig.platform) // Your application ID or bundle ID.
;


const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export async function createUser(email,password,username){
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if(!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username)

    await signIn(email,password)

    const newUser = await databases.createDocument(
      appWriteConfig.databaseId,
      appWriteConfig.userCollectionId,
      ID.unique(),{
        accountId: newAccount.$id,
        email: email,
        username: username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error);
  }
}

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    // const currentUser = await databases.listDocuments(
    //   config.databaseId,
    //   config.userCollectionId,
    //   [Query.equal("accountId", currentAccount.$id)]
    // );

    // if (!currentUser) throw Error;

    // return currentUser.documents[0];

    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
};