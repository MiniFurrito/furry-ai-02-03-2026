import gradio as gr
import torch
from diffusers import StableDiffusionPipeline

# ==================== MODELO LIGERO ====================
pipe = StableDiffusionPipeline.from_pretrained(
    "stabilityai/sd-turbo",
    torch_dtype=torch.float32,
    safety_checker=None
)
pipe = pipe.to("cpu")
pipe.enable_attention_slicing()

# ==================== ESTILOS ====================
STYLES = {
    "Cute": "cute furry, soft colors, pastel, big eyes, fluffy",
    "Anime": "anime style, vibrant colors, detailed fur",
    "Realistic": "realistic furry, detailed fur texture, cinematic",
}

# ==================== GENERACIÓN ====================
def generate(prompt: str, style: str):
    if not prompt.strip():
        raise gr.Error("El prompt no puede estar vacío")
    
    base = STYLES.get(style, STYLES["Cute"])
    full_prompt = f"{base}, anthropomorphic furry, {prompt}"
    
    negative = "blurry, low quality, bad anatomy, extra limbs, deformed, watermark, text"
    
    try:
        image = pipe(
            full_prompt,
            negative_prompt=negative,
            num_inference_steps=1,
            guidance_scale=0.0,
            height=256,
            width=256,
        ).images[0]
        return image
    except Exception as e:
        # ← Ahora verás el error REAL (esto es clave)
        raise gr.Error(f"Error real: {str(e)}")

# ==================== INTERFAZ ====================
with gr.Blocks(title="Furry AI Generator") as demo:
    gr.Markdown("# Furry AI Generator")
    
    with gr.Row():
        with gr.Column():
            prompt_box = gr.Textbox(label="Describe tu imagen", lines=3, placeholder="un zorro antropomórfico sonriendo")
            style_dropdown = gr.Dropdown(choices=list(STYLES.keys()), label="Estilo", value="Cute")
            
            with gr.Row():
                generate_btn = gr.Button("Generate", variant="primary")
                clear_btn = gr.Button("Clear", variant="secondary")
        
        with gr.Column():
            output_img = gr.Image(label="Resultado")
    
    generate_btn.click(generate, inputs=[prompt_box, style_dropdown], outputs=output_img)
    clear_btn.click(lambda: ("", "Cute", None), outputs=[prompt_box, style_dropdown, output_img])

demo.launch()