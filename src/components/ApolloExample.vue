<template>
  <div class="apollo-example">
    <div class="myrow">
      <div class="item">
        <h1>查：查询样例</h1>
        <query />
      </div>
      <div class="item">
        <h1>增改：增改tag样例</h1>
        <add />
      </div>
    </div>

    <br />
    <br />
    <div class="myrow">
      <div class="item">
        <h1>订阅测试</h1>
        <sub-item />
      </div>
      <div class="item">
        <h1>查询message</h1>
        <span style="color: #0f0"
          >apollo自己做了一层store, 下面的查询组件没有写 新增messagse 更新后
          重新请求视图的逻辑，但是左边的订阅监听到数据变化的话，下面的组件还是会自动更新</span
        >
        <query-message />
      </div>
    </div>

    <!-- Cute tiny form -->
    <!-- <div class="form">
      <label for="field-name" class="label">Name</label>
      <input v-model="name" placeholder="Type a name" class="input" id="field-name">
    </div> -->

    <!-- Tchat example -->
    <!-- <ApolloQuery :query="require('../graphql/Messages.gql')">
      <ApolloSubscribeToMore :document="require('../graphql/MessageAdded.gql')" :update-query="onMessageAdded" />

      <div slot-scope="{ result: { data } }">
        <template v-if="data">
          <div v-for="message of data.messages" :key="message.id" class="message">
            {{ message.text }}
          </div>
        </template>
      </div>
    </ApolloQuery>

    <ApolloMutation :mutation="require('../graphql/AddMessage.gql')" :variables="{
        input: {
          text: newMessage,
        },
      }" class="form" @done="newMessage = ''">
      <template slot-scope="{ mutate }">
        <form v-on:submit.prevent="formValid && mutate()">
          <label for="field-message">Message</label>
          <input id="field-message" v-model="newMessage" placeholder="Type a message" class="input">
        </form>
      </template>
    </ApolloMutation>-->
    <!-- <div class="images">
      <div v-for="file of files" :key="file.id" class="image-item">
        <img :src="`${$filesRoot}/${file.path}`" class="image" />
      </div>
    </div>

    <div class="image-input">
      <label for="field-image">Image</label>
      <input id="field-image" type="file" accept="image/*" required @change="onUploadImage">
    </div>-->
  </div>
</template>

<script>
import FILES from '../graphql/Files.gql';
import UPLOAD_FILE from '../graphql/UploadFile.gql';
import query from './query';
import add from './add';
import sub from './sub';
import queryMessage from './queryMessage';
export default {
  data() {
    return {
      name: 'Anne',
      newMessage: ''
    };
  },

  components: {
    query,
    add,
    subItem: sub,
    queryMessage
  },

  apollo: {
    files: FILES
  },

  computed: {
    formValid() {
      return this.newMessage;
    }
  },

  methods: {
    onMessageAdded(previousResult, { subscriptionData }) {
      return {
        messages: [
          ...previousResult.messages,
          subscriptionData.data.messageAdded
        ]
      };
    },

    async onUploadImage({ target }) {
      if (!target.validity.valid) return;
      await this.$apollo.mutate({
        mutation: UPLOAD_FILE,
        variables: {
          file: target.files[0]
        },
        update: (store, { data: { singleUpload } }) => {
          const data = store.readQuery({ query: FILES });
          data.files.push(singleUpload);
          store.writeQuery({ query: FILES, data });
        }
      });
    }
  }
};
</script>

<style scoped>
.form,
.input,
.apollo,
.message {
  padding: 12px;
}

label {
  display: block;
  margin-bottom: 6px;
}

.input {
  font-family: inherit;
  font-size: inherit;
  border: solid 2px #ccc;
  border-radius: 3px;
}

.error {
  color: red;
}

.myrow {
  display: flex;
}
.myrow .item {
  width: 50%;
}
</style>
