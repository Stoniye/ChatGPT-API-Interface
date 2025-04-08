## How to Set Up ChatGPT in 5 Minutes

Follow these step-by-step instructions to set up ChatGPT using the OpenAI API:  

1. Visit the [OpenAI Developer Platform](https://platform.openai.com/).  
2. Create an account or log in if you already have one.  
3. Navigate to the [API Keys tab](https://platform.openai.com/api-keys).  
4. Click on **"Create new key."**  
5. Follow the on-screen instructions.  
6. Once the key is created, click **"Copy"** to save it.  
7. Open the [ChatGPT-API-Interface](https://stoniye.github.io/ChatGPT-API-Interface/).  
8. Click the button in the top left corner.  
9. Paste your API key into the designated field.  
10. You're all set!  

**Note:** The API will only function if you have added funds to your OpenAI account on the [Billing Page](https://platform.openai.com/settings/organization/billing/overview).  

**Important:** Your API key is stored locally in your browser, ensuring that only you have access to it.  

---

## How It Works  

The website utilizes the official OpenAI API for ChatGPT.  

1. When you send a message, it is forwarded directly to OpenAI along with your API key, which identifies your account.  
2. OpenAI processes your request by tokenizing your input (splitting it into smaller parts for processing).  
3. ChatGPT generates a response, tokenizes it, and sends it back to your browser.  
4. OpenAI calculates the number of tokens used (both input and output) and deducts the corresponding cost from your account. You can check the pricing details [here](https://platform.openai.com/docs/pricing).  

To better understand how tokenization works, you can test it [here](https://platform.openai.com/tokenizer).  

If you only use ChatGPT occasionally, this pay-per-use method is often more cost-effective than a subscription, as each request typically costs just a few cents.  

---

## Why I Built This  

I created this for fun and i also wanted to use it because it's cheaper than a subscription.  

I also wanted to explain the entire process, so people who are not so familiar, can understand what happens in the background. You can verify it yourself by checking the code.  

I'm continuously working on the website and have planned some exciting new features:
1. **Support for file and image uploads**
2. **Support for image generation**
3. **More Customization with additional settings**
