from PIL import Image

image = Image.open("image.png")
# image.info contains dictionary of text chunks and embedded info
print(image.info)