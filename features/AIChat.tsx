import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';

const MODEL_LIST = [
  "abuse",
  "claude-3-5-sonnet-20240620",
  "claude-3-5-sonnet-20241022",
  "claude-3-7-sonnet-20250219",
  "claude-3-haiku-20240307",
  "claude-haiku-4-5-20251001",
  "claude-opus-4-1-20250805",
  "claude-opus-4-20250514",
  "claude-opus-4-5-20251101",
  "claude-sonnet-4-20250514",
  "claude-sonnet-4-5-20250929",
  "codestral-2508",
  "costly",
  "deepseek-chat",
  "deepseek-reasoner",
  "devstral-medium-2507",
  "devstral-small-2507",
  "fake",
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-2.5-pro",
  "gemini-3-pro-preview",
  "gpt-4.1",
  "gpt-4.1-mini",
  "gpt-4.1-nano",
  "gpt-4.5-preview",
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-5-2025-08-07",
  "gpt-5-chat-latest",
  "gpt-5-mini-2025-08-07",
  "gpt-5-nano-2025-08-07",
  "gpt-5.1",
  "gpt-5.1-chat-latest",
  "gpt-5.1-codex",
  "gpt-5.1-codex-mini",
  "gpt-5.2-2025-12-11",
  "gpt-5.2-chat-latest",
  "gpt-5.2-pro-2025-12-11",
  "grok-2",
  "grok-2-vision",
  "grok-3",
  "grok-3-fast",
  "grok-3-mini",
  "grok-3-mini-fast",
  "grok-beta",
  "grok-vision-beta",
  "magistral-medium-2509",
  "magistral-small-2509",
  "ministral-14b-2512",
  "ministral-3b-2512",
  "ministral-8b-2512",
  "mistral-large-latest",
  "mistral-medium-2508",
  "mistral-small-2506",
  "model-fallback-test-1",
  "o1",
  "o1-mini",
  "o1-pro",
  "o3",
  "o3-mini",
  "o4-mini",
  "open-mistral-7b",
  "open-mistral-nemo",
  "openrouter:ai21/jamba-large-1.7",
  "openrouter:ai21/jamba-mini-1.7",
  "openrouter:aion-labs/aion-1.0",
  "openrouter:aion-labs/aion-1.0-mini",
  "openrouter:aion-labs/aion-rp-llama-3.1-8b",
  "openrouter:alfredpros/codellama-7b-instruct-solidity",
  "openrouter:alibaba/tongyi-deepresearch-30b-a3b",
  "openrouter:alibaba/tongyi-deepresearch-30b-a3b:free",
  "openrouter:allenai/olmo-2-0325-32b-instruct",
  "openrouter:allenai/olmo-3-32b-think:free",
  "openrouter:allenai/olmo-3-7b-instruct",
  "openrouter:allenai/olmo-3-7b-think",
  "openrouter:alpindale/goliath-120b",
  "openrouter:amazon/nova-2-lite-v1",
  "openrouter:amazon/nova-2-lite-v1:free",
  "openrouter:amazon/nova-lite-v1",
  "openrouter:amazon/nova-micro-v1",
  "openrouter:amazon/nova-premier-v1",
  "openrouter:amazon/nova-pro-v1",
  "openrouter:anthracite-org/magnum-v4-72b",
  "openrouter:anthropic/claude-3-haiku",
  "openrouter:anthropic/claude-3-opus",
  "openrouter:anthropic/claude-3.5-haiku",
  "openrouter:anthropic/claude-3.5-haiku-20241022",
  "openrouter:anthropic/claude-3.5-sonnet",
  "openrouter:anthropic/claude-3.7-sonnet",
  "openrouter:anthropic/claude-3.7-sonnet:thinking",
  "openrouter:anthropic/claude-haiku-4.5",
  "openrouter:anthropic/claude-opus-4",
  "openrouter:anthropic/claude-opus-4.1",
  "openrouter:anthropic/claude-opus-4.5",
  "openrouter:anthropic/claude-sonnet-4",
  "openrouter:anthropic/claude-sonnet-4.5",
  "openrouter:arcee-ai/coder-large",
  "openrouter:arcee-ai/maestro-reasoning",
  "openrouter:arcee-ai/spotlight",
  "openrouter:arcee-ai/trinity-mini",
  "openrouter:arcee-ai/trinity-mini:free",
  "openrouter:arcee-ai/virtuoso-large",
  "openrouter:arliai/qwq-32b-arliai-rpr-v1",
  "openrouter:baidu/ernie-4.5-21b-a3b",
  "openrouter:baidu/ernie-4.5-21b-a3b-thinking",
  "openrouter:baidu/ernie-4.5-300b-a47b",
  "openrouter:baidu/ernie-4.5-vl-28b-a3b",
  "openrouter:baidu/ernie-4.5-vl-424b-a47b",
  "openrouter:bytedance/ui-tars-1.5-7b",
  "openrouter:cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
  "openrouter:cohere/command-a",
  "openrouter:cohere/command-r-08-2024",
  "openrouter:cohere/command-r-plus-08-2024",
  "openrouter:cohere/command-r7b-12-2024",
  "openrouter:deepcogito/cogito-v2-preview-llama-109b-moe",
  "openrouter:deepcogito/cogito-v2-preview-llama-405b",
  "openrouter:deepcogito/cogito-v2-preview-llama-70b",
  "openrouter:deepcogito/cogito-v2.1-671b",
  "openrouter:deepseek/deepseek-chat",
  "openrouter:deepseek/deepseek-chat-v3-0324",
  "openrouter:deepseek/deepseek-chat-v3.1",
  "openrouter:deepseek/deepseek-prover-v2",
  "openrouter:deepseek/deepseek-r1",
  "openrouter:deepseek/deepseek-r1-0528",
  "openrouter:deepseek/deepseek-r1-0528-qwen3-8b",
  "openrouter:deepseek/deepseek-r1-distill-llama-70b",
  "openrouter:deepseek/deepseek-r1-distill-qwen-14b",
  "openrouter:deepseek/deepseek-r1-distill-qwen-32b",
  "openrouter:deepseek/deepseek-v3.1-terminus",
  "openrouter:deepseek/deepseek-v3.1-terminus:exacto",
  "openrouter:deepseek/deepseek-v3.2",
  "openrouter:deepseek/deepseek-v3.2-exp",
  "openrouter:deepseek/deepseek-v3.2-speciale",
  "openrouter:eleutherai/llemma_7b",
  "openrouter:essentialai/rnj-1-instruct",
  "openrouter:google/gemini-2.0-flash-001",
  "openrouter:google/gemini-2.0-flash-exp:free",
  "openrouter:google/gemini-2.0-flash-lite-001",
  "openrouter:google/gemini-2.5-flash",
  "openrouter:google/gemini-2.5-flash-image",
  "openrouter:google/gemini-2.5-flash-image-preview",
  "openrouter:google/gemini-2.5-flash-lite",
  "openrouter:google/gemini-2.5-flash-lite-preview-09-2025",
  "openrouter:google/gemini-2.5-flash-preview-09-2025",
  "openrouter:google/gemini-2.5-pro",
  "openrouter:google/gemini-2.5-pro-preview",
  "openrouter:google/gemini-2.5-pro-preview-05-06",
  "openrouter:google/gemini-3-pro-image-preview",
  "openrouter:google/gemini-3-pro-preview",
  "openrouter:google/gemma-2-27b-it",
  "openrouter:google/gemma-2-9b-it",
  "openrouter:google/gemma-3-12b-it",
  "openrouter:google/gemma-3-12b-it:free",
  "openrouter:google/gemma-3-27b-it",
  "openrouter:google/gemma-3-27b-it:free",
  "openrouter:google/gemma-3-4b-it",
  "openrouter:google/gemma-3-4b-it:free",
  "openrouter:google/gemma-3n-e2b-it:free",
  "openrouter:google/gemma-3n-e4b-it",
  "openrouter:google/gemma-3n-e4b-it:free",
  "openrouter:gryphe/mythomax-l2-13b",
  "openrouter:ibm-granite/granite-4.0-h-micro",
  "openrouter:inception/mercury",
  "openrouter:inception/mercury-coder",
  "openrouter:inflection/inflection-3-pi",
  "openrouter:inflection/inflection-3-productivity",
  "openrouter:kwaipilot/kat-coder-pro:free",
  "openrouter:liquid/lfm-2.2-6b",
  "openrouter:liquid/lfm2-8b-a1b",
  "openrouter:mancer/weaver",
  "openrouter:meituan/longcat-flash-chat",
  "openrouter:meta-llama/llama-3-70b-instruct",
  "openrouter:meta-llama/llama-3-8b-instruct",
  "openrouter:meta-llama/llama-3.1-405b",
  "openrouter:meta-llama/llama-3.1-405b-instruct",
  "openrouter:meta-llama/llama-3.1-70b-instruct",
  "openrouter:meta-llama/llama-3.1-8b-instruct",
  "openrouter:meta-llama/llama-3.2-11b-vision-instruct",
  "openrouter:meta-llama/llama-3.2-1b-instruct",
  "openrouter:meta-llama/llama-3.2-3b-instruct",
  "openrouter:meta-llama/llama-3.2-3b-instruct:free",
  "openrouter:meta-llama/llama-3.2-90b-vision-instruct",
  "openrouter:meta-llama/llama-3.3-70b-instruct",
  "openrouter:meta-llama/llama-3.3-70b-instruct:free",
  "openrouter:meta-llama/llama-4-maverick",
  "openrouter:meta-llama/llama-4-scout",
  "openrouter:meta-llama/llama-guard-2-8b",
  "openrouter:meta-llama/llama-guard-3-8b",
  "openrouter:meta-llama/llama-guard-4-12b",
  "openrouter:meta-llama/llama-guard-4-12b:free",
  "openrouter:microsoft/phi-3-medium-128k-instruct",
  "openrouter:microsoft/phi-3-mini-128k-instruct",
  "openrouter:microsoft/phi-3.5-mini-128k-instruct",
  "openrouter:microsoft/phi-4",
  "openrouter:microsoft/phi-4-multimodal-instruct",
  "openrouter:microsoft/phi-4-reasoning-plus",
  "openrouter:microsoft/wizardlm-2-8x22b",
  "openrouter:minimax/minimax-01",
  "openrouter:minimax/minimax-m1",
  "openrouter:minimax/minimax-m2",
  "openrouter:mistralai/codestral-2508",
  "openrouter:mistralai/devstral-2512",
  "openrouter:mistralai/devstral-2512:free",
  "openrouter:mistralai/devstral-medium",
  "openrouter:mistralai/devstral-small",
  "openrouter:mistralai/devstral-small-2505",
  "openrouter:mistralai/ministral-14b-2512",
  "openrouter:mistralai/ministral-3b",
  "openrouter:mistralai/ministral-3b-2512",
  "openrouter:mistralai/ministral-8b",
  "openrouter:mistralai/ministral-8b-2512",
  "openrouter:mistralai/mistral-7b-instruct",
  "openrouter:mistralai/mistral-7b-instruct-v0.1",
  "openrouter:mistralai/mistral-7b-instruct-v0.2",
  "openrouter:mistralai/mistral-7b-instruct-v0.3",
  "openrouter:mistralai/mistral-7b-instruct:free",
  "openrouter:mistralai/mistral-large",
  "openrouter:mistralai/mistral-large-2407",
  "openrouter:mistralai/mistral-large-2411",
  "openrouter:mistralai/mistral-large-2512",
  "openrouter:mistralai/mistral-medium-3",
  "openrouter:mistralai/mistral-medium-3.1",
  "openrouter:mistralai/mistral-nemo",
  "openrouter:mistralai/mistral-saba",
  "openrouter:mistralai/mistral-small-24b-instruct-2501",
  "openrouter:mistralai/mistral-small-3.1-24b-instruct",
  "openrouter:mistralai/mistral-small-3.1-24b-instruct:free",
  "openrouter:mistralai/mistral-small-3.2-24b-instruct",
  "openrouter:mistralai/mistral-tiny",
  "openrouter:mistralai/mixtral-8x22b-instruct",
  "openrouter:mistralai/mixtral-8x7b-instruct",
  "openrouter:mistralai/pixtral-12b",
  "openrouter:mistralai/pixtral-large-2411",
  "openrouter:mistralai/voxtral-small-24b-2507",
  "openrouter:moonshotai/kimi-dev-72b",
  "openrouter:moonshotai/kimi-k2",
  "openrouter:moonshotai/kimi-k2-0905",
  "openrouter:moonshotai/kimi-k2-0905:exacto",
  "openrouter:moonshotai/kimi-k2-thinking",
  "openrouter:moonshotai/kimi-k2:free",
  "openrouter:morph/morph-v3-fast",
  "openrouter:morph/morph-v3-large",
  "openrouter:neversleep/llama-3.1-lumimaid-8b",
  "openrouter:neversleep/noromaid-20b",
  "openrouter:nex-agi/deepseek-v3.1-nex-n1:free",
  "openrouter:nousresearch/deephermes-3-mistral-24b-preview",
  "openrouter:nousresearch/hermes-2-pro-llama-3-8b",
  "openrouter:nousresearch/hermes-3-llama-3.1-405b",
  "openrouter:nousresearch/hermes-3-llama-3.1-405b:free",
  "openrouter:nousresearch/hermes-3-llama-3.1-70b",
  "openrouter:nousresearch/hermes-4-405b",
  "openrouter:nousresearch/hermes-4-70b",
  "openrouter:nvidia/llama-3.1-nemotron-70b-instruct",
  "openrouter:nvidia/llama-3.1-nemotron-ultra-253b-v1",
  "openrouter:nvidia/llama-3.3-nemotron-super-49b-v1.5",
  "openrouter:nvidia/nemotron-nano-12b-v2-vl",
  "openrouter:nvidia/nemotron-nano-12b-v2-vl:free",
  "openrouter:nvidia/nemotron-nano-9b-v2",
  "openrouter:nvidia/nemotron-nano-9b-v2:free",
  "openrouter:openai/chatgpt-4o-latest",
  "openrouter:openai/codex-mini",
  "openrouter:openai/gpt-3.5-turbo",
  "openrouter:openai/gpt-3.5-turbo-0613",
  "openrouter:openai/gpt-3.5-turbo-16k",
  "openrouter:openai/gpt-3.5-turbo-instruct",
  "openrouter:openai/gpt-4",
  "openrouter:openai/gpt-4-0314",
  "openrouter:openai/gpt-4-1106-preview",
  "openrouter:openai/gpt-4-turbo",
  "openrouter:openai/gpt-4-turbo-preview",
  "openrouter:openai/gpt-4.1",
  "openrouter:openai/gpt-4.1-mini",
  "openrouter:openai/gpt-4.1-nano",
  "openrouter:openai/gpt-4o",
  "openrouter:openai/gpt-4o-2024-05-13",
  "openrouter:openai/gpt-4o-2024-08-06",
  "openrouter:openai/gpt-4o-2024-11-20",
  "openrouter:openai/gpt-4o-audio-preview",
  "openrouter:openai/gpt-4o-mini",
  "openrouter:openai/gpt-4o-mini-2024-07-18",
  "openrouter:openai/gpt-4o-mini-search-preview",
  "openrouter:openai/gpt-4o-search-preview",
  "openrouter:openai/gpt-4o:extended",
  "openrouter:openai/gpt-5",
  "openrouter:openai/gpt-5-chat",
  "openrouter:openai/gpt-5-codex",
  "openrouter:openai/gpt-5-image",
  "openrouter:openai/gpt-5-image-mini",
  "openrouter:openai/gpt-5-mini",
  "openrouter:openai/gpt-5-nano",
  "openrouter:openai/gpt-5-pro",
  "openrouter:openai/gpt-5.1",
  "openrouter:openai/gpt-5.1-chat",
  "openrouter:openai/gpt-5.1-codex",
  "openrouter:openai/gpt-5.1-codex-max",
  "openrouter:openai/gpt-5.1-codex-mini",
  "openrouter:openai/gpt-5.2",
  "openrouter:openai/gpt-5.2-chat",
  "openrouter:openai/gpt-5.2-pro",
  "openrouter:openai/gpt-oss-120b",
  "openrouter:openai/gpt-oss-120b:exacto",
  "openrouter:openai/gpt-oss-120b:free",
  "openrouter:openai/gpt-oss-20b",
  "openrouter:openai/gpt-oss-20b:free",
  "openrouter:openai/gpt-oss-safeguard-20b",
  "openrouter:openai/o1",
  "openrouter:openai/o1-pro",
  "openrouter:openai/o3",
  "openrouter:openai/o3-deep-research",
  "openrouter:openai/o3-mini",
  "openrouter:openai/o3-mini-high",
  "openrouter:openai/o3-pro",
  "openrouter:openai/o4-mini",
  "openrouter:openai/o4-mini-deep-research",
  "openrouter:openai/o4-mini-high",
  "openrouter:opengvlab/internvl3-78b",
  "openrouter:openrouter/auto",
  "openrouter:openrouter/bodybuilder",
  "openrouter:perplexity/sonar",
  "openrouter:perplexity/sonar-deep-research",
  "openrouter:perplexity/sonar-pro",
  "openrouter:perplexity/sonar-pro-search",
  "openrouter:perplexity/sonar-reasoning",
  "openrouter:perplexity/sonar-reasoning-pro",
  "openrouter:prime-intellect/intellect-3",
  "openrouter:qwen/qwen-2.5-72b-instruct",
  "openrouter:qwen/qwen-2.5-7b-instruct",
  "openrouter:qwen/qwen-2.5-coder-32b-instruct",
  "openrouter:qwen/qwen-2.5-vl-7b-instruct",
  "openrouter:qwen/qwen-max",
  "openrouter:qwen/qwen-plus",
  "openrouter:qwen/qwen-plus-2025-07-28",
  "openrouter:qwen/qwen-plus-2025-07-28:thinking",
  "openrouter:qwen/qwen-turbo",
  "openrouter:qwen/qwen-vl-max",
  "openrouter:qwen/qwen-vl-plus",
  "openrouter:qwen/qwen2.5-coder-7b-instruct",
  "openrouter:qwen/qwen2.5-vl-32b-instruct",
  "openrouter:qwen/qwen2.5-vl-72b-instruct",
  "openrouter:qwen/qwen3-14b",
  "openrouter:qwen/qwen3-235b-a22b",
  "openrouter:qwen/qwen3-235b-a22b-2507",
  "openrouter:qwen/qwen3-235b-a22b-thinking-2507",
  "openrouter:qwen/qwen3-235b-a22b:free",
  "openrouter:qwen/qwen3-30b-a3b",
  "openrouter:qwen/qwen3-30b-a3b-instruct-2507",
  "openrouter:qwen/qwen3-30b-a3b-thinking-2507",
  "openrouter:qwen/qwen3-32b",
  "openrouter:qwen/qwen3-4b:free",
  "openrouter:qwen/qwen3-8b",
  "openrouter:qwen/qwen3-coder",
  "openrouter:qwen/qwen3-coder-30b-a3b-instruct",
  "openrouter:qwen/qwen3-coder-flash",
  "openrouter:qwen/qwen3-coder-plus",
  "openrouter:qwen/qwen3-coder:exacto",
  "openrouter:qwen/qwen3-coder:free",
  "openrouter:qwen/qwen3-max",
  "openrouter:qwen/qwen3-next-80b-a3b-instruct",
  "openrouter:qwen/qwen3-next-80b-a3b-thinking",
  "openrouter:qwen/qwen3-vl-235b-a22b-instruct",
  "openrouter:qwen/qwen3-vl-235b-a22b-thinking",
  "openrouter:qwen/qwen3-vl-30b-a3b-instruct",
  "openrouter:qwen/qwen3-vl-30b-a3b-thinking",
  "openrouter:qwen/qwen3-vl-8b-instruct",
  "openrouter:qwen/qwen3-vl-8b-thinking",
  "openrouter:qwen/qwq-32b",
  "openrouter:raifle/sorcererlm-8x22b",
  "openrouter:relace/relace-apply-3",
  "openrouter:relace/relace-search",
  "openrouter:sao10k/l3-euryale-70b",
  "openrouter:sao10k/l3-lunaris-8b",
  "openrouter:sao10k/l3.1-70b-hanami-x1",
  "openrouter:sao10k/l3.1-euryale-70b",
  "openrouter:sao10k/l3.3-euryale-70b",
  "openrouter:stepfun-ai/step3",
  "openrouter:switchpoint/router",
  "openrouter:tencent/hunyuan-a13b-instruct",
  "openrouter:thedrummer/cydonia-24b-v4.1",
  "openrouter:thedrummer/rocinante-12b",
  "openrouter:thedrummer/skyfall-36b-v2",
  "openrouter:thedrummer/unslopnemo-12b",
  "openrouter:thudm/glm-4.1v-9b-thinking",
  "openrouter:tngtech/deepseek-r1t-chimera",
  "openrouter:tngtech/deepseek-r1t-chimera:free",
  "openrouter:tngtech/deepseek-r1t2-chimera",
  "openrouter:tngtech/deepseek-r1t2-chimera:free",
  "openrouter:tngtech/tng-r1t-chimera",
  "openrouter:tngtech/tng-r1t-chimera:free",
  "openrouter:undi95/remm-slerp-l2-13b",
  "openrouter:x-ai/grok-3",
  "openrouter:x-ai/grok-3-beta",
  "openrouter:x-ai/grok-3-mini",
  "openrouter:x-ai/grok-3-mini-beta",
  "openrouter:x-ai/grok-4",
  "openrouter:x-ai/grok-4-fast",
  "openrouter:x-ai/grok-4.1-fast",
  "openrouter:x-ai/grok-code-fast-1",
  "openrouter:z-ai/glm-4-32b",
  "openrouter:z-ai/glm-4.5",
  "openrouter:z-ai/glm-4.5-air",
  "openrouter:z-ai/glm-4.5-air:free",
  "openrouter:z-ai/glm-4.5v",
  "openrouter:z-ai/glm-4.6",
  "openrouter:z-ai/glm-4.6:exacto",
  "openrouter:z-ai/glm-4.6v",
  "pixtral-large-2411",
  "togetherai:arcee-ai/trinity-mini",
  "togetherai:arize-ai/qwen-2-1.5b-instruct",
  "togetherai:deepcogito/cogito-v2-1-671b",
  "togetherai:deepcogito/cogito-v2-preview-llama-109b-moe",
  "togetherai:deepcogito/cogito-v2-preview-llama-405b",
  "togetherai:deepcogito/cogito-v2-preview-llama-70b",
  "togetherai:deepseek-ai/deepseek-r1",
  "togetherai:deepseek-ai/deepseek-r1-0528-tput",
  "togetherai:deepseek-ai/deepseek-r1-distill-llama-70b",
  "togetherai:deepseek-ai/deepseek-v3",
  "togetherai:deepseek-ai/deepseek-v3.1",
  "togetherai:essentialai/rnj-1-instruct",
  "togetherai:google/gemma-3n-e4b-it",
  "togetherai:marin-community/marin-8b-instruct",
  "togetherai:mercor/cwm",
  "togetherai:meta-llama/llama-3-70b-chat-hf",
  "togetherai:meta-llama/llama-3-70b-hf",
  "togetherai:meta-llama/llama-3.1-405b-instruct",
  "togetherai:meta-llama/llama-3.2-1b-instruct",
  "togetherai:meta-llama/llama-3.2-3b-instruct-turbo",
  "togetherai:meta-llama/llama-3.3-70b-instruct-turbo",
  "togetherai:meta-llama/llama-4-maverick-17b-128e-instruct-fp8",
  "togetherai:meta-llama/llama-4-scout-17b-16e-instruct",
  "togetherai:meta-llama/llama-guard-3-11b-vision-turbo",
  "togetherai:meta-llama/llama-guard-4-12b",
  "togetherai:meta-llama/llama-guard-7b",
  "togetherai:meta-llama/llamaguard-2-8b",
  "togetherai:meta-llama/meta-llama-3-70b-instruct-turbo",
  "togetherai:meta-llama/meta-llama-3-8b-instruct",
  "togetherai:meta-llama/meta-llama-3-8b-instruct-lite",
  "togetherai:meta-llama/meta-llama-3.1-405b-instruct-lite-pro",
  "togetherai:meta-llama/meta-llama-3.1-405b-instruct-turbo",
  "togetherai:meta-llama/meta-llama-3.1-70b-instruct-reference",
  "togetherai:meta-llama/meta-llama-3.1-70b-instruct-turbo",
  "togetherai:meta-llama/meta-llama-3.1-8b-instruct-reference",
  "togetherai:meta-llama/meta-llama-3.1-8b-instruct-turbo",
  "togetherai:meta-llama/meta-llama-guard-3-8b",
  "togetherai:mistralai/ministral-3-14b-instruct-2512",
  "togetherai:mistralai/mistral-7b-instruct-v0.2",
  "togetherai:mistralai/mistral-7b-instruct-v0.3",
  "togetherai:mistralai/mistral-small-24b-instruct-2501",
  "togetherai:mistralai/mixtral-8x7b-instruct-v0.1",
  "togetherai:moonshotai/kimi-k2-instruct-0905",
  "togetherai:moonshotai/kimi-k2-thinking",
  "togetherai:nvidia/nvidia-nemotron-nano-9b-v2",
  "togetherai:openai/gpt-oss-120b",
  "togetherai:openai/gpt-oss-20b",
  "togetherai:qwen/qwen2.5-14b-instruct",
  "togetherai:qwen/qwen2.5-72b-instruct",
  "togetherai:qwen/qwen2.5-72b-instruct-turbo",
  "togetherai:qwen/qwen2.5-7b-instruct-turbo",
  "togetherai:qwen/qwen2.5-vl-72b-instruct",
  "togetherai:qwen/qwen3-235b-a22b-fp8-tput",
  "togetherai:qwen/qwen3-235b-a22b-instruct-2507-tput",
  "togetherai:qwen/qwen3-235b-a22b-thinking-2507",
  "togetherai:qwen/qwen3-coder-480b-a35b-instruct-fp8",
  "togetherai:qwen/qwen3-next-80b-a3b-instruct",
  "togetherai:qwen/qwen3-next-80b-a3b-thinking",
  "togetherai:qwen/qwen3-vl-32b-instruct",
  "togetherai:scb10x/scb10x-typhoon-2-1-gemma3-12b",
  "togetherai:servicenow-ai/apriel-1.5-15b-thinker",
  "togetherai:servicenow-ai/apriel-1.6-15b-thinker",
  "togetherai:togethercomputer/moa-1",
  "togetherai:togethercomputer/moa-1-turbo",
  "togetherai:togethercomputer/refuel-llm-v2",
  "togetherai:togethercomputer/refuel-llm-v2-small",
  "togetherai:virtue-ai/virtueguard-text-lite",
  "togetherai:zai-org/glm-4.5-air-fp8",
  "togetherai:zai-org/glm-4.6",
  "usage-limited",
  "voxtral-mini-2507",
  "voxtral-small-2507"
];

// Helper to group models
const groupedModels = MODEL_LIST.reduce((acc, model) => {
  let group = 'Standard';
  if (model.startsWith('openrouter:')) {
    group = 'OpenRouter';
  } else if (model.startsWith('togetherai:')) {
    group = 'TogetherAI';
  }
  
  if (!acc[group]) {
    acc[group] = [];
  }
  acc[group].push(model);
  return acc;
}, {} as Record<string, string[]>);

// Sort keys: Standard first, then OpenRouter, then TogetherAI
const groupOrder = ['Standard', 'OpenRouter', 'TogetherAI'];

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm powered by Puter.js AI. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState('gpt-4o-mini'); // Default model
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Create new history including the user message
    const newMessage: Message = { role: 'user', content: userMessage };
    const updatedMessages = [...messages, newMessage];
    
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Pass full history to puter.ai.chat for context
      const response = await puter.ai.chat(updatedMessages, { stream: true, model: model });
      
      let fullResponse = '';
      // Add placeholder for assistant response
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      for await (const part of response) {
        // Robust check for text content: handle object with text property or raw string
        const text = part?.text ?? (typeof part === 'string' ? part : '');
        
        if (text) {
          fullResponse += text;
          setMessages(prev => {
            const newMsgs = [...prev];
            const lastMsg = newMsgs[newMsgs.length - 1];
            if (lastMsg.role === 'assistant') {
              lastMsg.content = fullResponse;
            }
            return newMsgs;
          });
        }
      }
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => {
          // If we added an empty assistant message, update it. Otherwise add one.
          const lastMsg = prev[prev.length - 1];
          if (lastMsg.role === 'assistant' && lastMsg.content === '') {
              const newMsgs = [...prev];
              newMsgs[newMsgs.length - 1].content = 'Sorry, I encountered an error connecting to the AI service. Please try a different model.';
              return newMsgs;
          }
          return [...prev, { role: 'assistant', content: 'Sorry, I encountered an error connecting to the AI service. Please try a different model.' }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden m-4">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Bot size={20} className="text-blue-500" />
          AI Assistant
        </h3>
        <select 
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="text-xs border border-slate-300 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[200px]"
        >
          {groupOrder.map(group => (
            <optgroup label={group} key={group}>
              {groupedModels[group]?.map(m => {
                const displayName = group === 'OpenRouter' ? m.replace('openrouter:', '') : 
                                    group === 'TogetherAI' ? m.replace('togetherai:', '') : m;
                return (
                  <option key={m} value={m}>{displayName}</option>
                );
              })}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'
              }`}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
           <div className="flex justify-start">
             <div className="bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-slate-400" />
                <span className="text-xs text-slate-400">Thinking...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIChat;