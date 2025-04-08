<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Define types
interface Message {
  role: 'assistant' | 'user' | 'system'
  content: string
}

// State
const title = ref<string>('')
const fullTitle = 'This is Nuxt on Netlify, start chatting below...'
const errorMessage =  'We could not determine your model provider, check your environment variables.'
const typeDelay = 30
const chatHistory = ref<Message[]>([{ role: 'assistant', content: '' }])
const loading = ref<boolean>(false)
const message = ref<string>('')
const modelProvider = (useRuntimeConfig().public.MODEL_PROVIDER || '').toLowerCase();

// Methods
const typeText = async () => {
  if (modelProvider === 'anthropic' || modelProvider === 'openai') {
    for (let i = 0; i < fullTitle.length; i++) {
      await new Promise(resolve => setTimeout(resolve, typeDelay))
      title.value = fullTitle.slice(0, i + 1)
    }
  } else {
    title.value = errorMessage
  }
}

//Scroll messages as they are added
const scrollToEnd = () => {
  setTimeout(() => {
    const chatMessages = document.querySelector('.chat-messages > div:last-child')
    chatMessages?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, 50)
}

//Send prompt to API
const sendPrompt = async () => {
  if (!message.value) return
  
  loading.value = true
  chatHistory.value.push({
    role: 'user',
    content: message.value
  })

  scrollToEnd()
  message.value = ''

  try {
    console.log(`Provider: ${modelProvider}`)
    const res = await fetch(`/api/${modelProvider}`, {
      method: 'POST',
      body: JSON.stringify(chatHistory.value.slice(1))
    })

    if (res.ok) {
      const response = await res.json()
      chatHistory.value.push({
        role: 'assistant',
        content: response?.message
      })
    } else {
      throw new Error('API request failed')
    }
  } catch (error) {
    chatHistory.value.push({
      role: 'system',
      content: 'Sorry, an error occurred.'
    })
  } finally {
    loading.value = false
    scrollToEnd()
  }
}

// Initialize typing animation
onMounted(() => {
  typeText()
})
</script>

<template>
  <div class="min-h-screen bg-gradient flex items-center px-4 md:px-8">
    <div class="max-w-xl mx-auto flex flex-col space-y-8">
      <div class="flex justify-center mb-4">
        <div class="logo-container">
          <img 
            v-if="modelProvider === 'openai'" 
            src="/openai.svg" 
            alt="OpenAI Logo" 
            class="w-12 h-12"
          />
          <img 
            v-else-if="modelProvider === 'anthropic'" 
            src="/anthropic.svg" 
            alt="Anthropic Logo" 
            class="w-12 h-12"
          />
          <img 
            v-else 
            src="/model-not-found.svg" 
            alt="Model Not Found" 
            class="w-12 h-12"
          />
        </div>
      </div>
      
      <h1 class="text-2xl font-bold text-center text-white">
        {{ title }}<span class="animate-pulse">|</span>
      </h1>
      
      <div class="max-w-5xl mx-auto w-full">
        <div class="bg-[#1C1C1C] rounded-2xl shadow-lg h-[40vh] flex flex-col justify-between">
          <div class="h-full overflow-auto chat-messages p-6">
          <!-- Chat box and chat history -->
            <div 
              v-for="(msg, i) in chatHistory" 
              :key="i" 
              class="flex flex-col mb-4"
            >
              <div 
                :class="[
                  msg.role === 'assistant' ? 'pr-8' : 'pl-8 ml-auto',
                ]"
              >
                <div class="p-3 text-sm text-white bg-[#2C2C2C] rounded-2xl" :class="[
                  msg.role === 'assistant' ? 'max-w-[80%]' : ''
                ]">
                  {{ msg.content }}
                </div>
              </div>
            </div>
            <div 
              v-if="loading" 
              class="p-4 ml-10 mr-auto"
            >
              <span class="loader" />
            </div>
          </div>

          <form @submit.prevent="sendPrompt" class="p-4 bg-[#1C1C1C] border-t border-[#2C2C2C] rounded-b-2xl">
            <div class="flex items-center w-full gap-2">
              <input
                v-model="message"
                type="text"
                placeholder="Ask anything..."
                class="w-full p-3 text-sm text-white bg-[#2C2C2C] rounded-xl border-none focus:ring-0 focus:outline-none"
              />
              <button
                type="submit"
                class="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>

      <div class="flex justify-center items-center space-x-6">
        <NuxtLink
          to="https://netlify.com/"
          class="flex items-center font-medium underline transition-colors underline-offset-4 hover:text-black/70"
        >
          <img src="/netlify.svg" class="h-6" alt="Netlify Logo" />
        </NuxtLink>
        <NuxtLink
          to="https://nuxt.com/docs"
          :class="[
            'flex items-center font-medium underline transition-colors underline-offset-4 hover:text-black/70',
            loading ? 'animate-pulse' : ''
          ]"
        >
          <img src="/nuxt.svg" class="h-6" alt="Nuxt Logo" />
        </NuxtLink>
        <NuxtLink
          to="https://github.com/SeanMcTernan/nuxt_chat_app"
          class="flex items-center font-medium underline transition-colors underline-offset-4 hover:text-black/70"
        >
          <img src="/github.svg" class="h-4" alt="GitHub Logo" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style>
html, 
body {
  overflow: hidden;
  overscroll-behavior: none;
  height: 100%;
}

.bg-gradient {
  background: radial-gradient(100% 100% at 50% 50%, #000000, #001615, #000000);
  background-size: 400% 400%;
  animation: gradientBg 30s ease infinite;
}

@keyframes gradientBg {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.loader {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: block;
  position: relative;
  color: #2C2C2C;
  box-sizing: border-box;
  animation: animloader 2s linear infinite;
}

@keyframes animloader {
  0% { box-shadow: 14px 0 0 -2px, 38px 0 0 -2px, -14px 0 0 -2px, -38px 0 0 -2px; }
  25% { box-shadow: 14px 0 0 -2px, 38px 0 0 -2px, -14px 0 0 -2px, -38px 0 0 2px; }
  50% { box-shadow: 14px 0 0 -2px, 38px 0 0 -2px, -14px 0 0 2px, -38px 0 0 -2px; }
  75% { box-shadow: 14px 0 0 2px, 38px 0 0 -2px; }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}

.animate-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.logo-container {
  animation: pulse 5s ease-in-out infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.3;
  }
}
</style>