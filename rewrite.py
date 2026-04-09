import json

with open('src/components/LearningMap.tsx', 'r', encoding='utf-8') as f:
    orig = f.read()

# Instead of a complex replace, we will write a streamlined one.
# First let's remove the modal and replace it with a floating tooltip.
