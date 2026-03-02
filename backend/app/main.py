from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.concurrency import run_in_threadpool

from diffusers import StableDiffusionPipeline
import torch
from io import BytesIO
import base64

app = FastAPI()

# Permitir frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----- MODELO -----
pipe = StableDiffusionPipeline.from_pretrained(
    #"runwayml/stable-diffusion-v1-5",
    "stabilityai/sd-turbo",
    torch_dtype=torch.float32,
    safety_checker=None
)

pipe = pipe.to("cpu")

pipe.enable_attention_slicing()


# ----- ESTILOS -----
STYLES = {
    "cute": "cute furry, soft colors, pastel palette, big eyes, wholesome, fluffy",
    "anime": "anime style, cel shading, vibrant colors, sharp lineart",
    "realistic": "realistic fur texture, cinematic lighting, high detail, 8k",
    "kemono": "kemono style, large expressive eyes, colorful fur, glossy shading",
    "feral": "feral furry, quadruped, animalistic proportions, natural environment",
    "chibi": "chibi style, small body, oversized head, adorable proportions",
    "dark": "dark fantasy furry, dramatic shadows, moody lighting",
    "cyberpunk": "cyberpunk furry, neon lights, futuristic city, glowing accents",
    "fantasy": "fantasy furry, magical aura, enchanted forest, glowing particles",
    "watercolor": "watercolor painting style, soft brush strokes, artistic texture",
    "sketch": "pencil sketch style, lineart focus, monochrome drawing",
    "comic": "comic book style, bold outlines, halftone shading",
    "pixel": "pixel art style, 16-bit aesthetic",
    "oil": "oil painting style, thick brush strokes, museum quality",
}


DEFAULT_NEGATIVE = "blurry, low quality, bad anatomy, extra limbs, extra fingers, deformed hands, poorly drawn face"

# ----- REQUEST MODEL -----
class GenerateRequest(BaseModel):
    prompt: str
    style: str
    negative_prompt: str = ""
    num_images: int = 1
    nsfw: bool = False

# ----- ENDPOINT -----
@app.post("/generate")
async def generate(data: GenerateRequest):

    base_style = STYLES.get(data.style, "")
    full_prompt = f"{base_style}, {data.prompt}"

    negative_prompt = f"{DEFAULT_NEGATIVE}, {data.negative_prompt}"

    print("Generating image...")
    print("Prompt:", full_prompt)

    result = await run_in_threadpool(
        pipe,
        full_prompt,
        negative_prompt=negative_prompt,
        num_images_per_prompt=data.num_images,
        guidance_scale=7.5,
        #num_inference_steps=15,
        num_inference_steps=5,
        #height=320,
        height=200,
        #width=320,
        width=200,
    )

    images = result.images
    img_list = []

    for img in images:
        buffer = BytesIO()
        img.save(buffer, format="PNG")
        img_str = base64.b64encode(buffer.getvalue()).decode()
        img_list.append(img_str)

    return {"images": img_list}
