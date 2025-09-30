# Major Studio 1 Protype 1 - Revolutionary War Portraits

## Data Proccessing
- Downloaded huggingface dataset, queried for any item with "sitter" or "portrait" keywords
- used python to extract sitter names, artist names, put in new columns
- "summary statistics" -> python to count number of portraits per sitter -> CSV export -> json converted
- filtered out "unidentified" sitters when importing json 

## Visualization:

![Basic Viz](https://github.com/nmolnar-parsons/major-studio-1/blob/main/Project_1/Readme_images/image1.png)

![Selected Sitter](https://github.com/nmolnar-parsons/major-studio-1/blob/main/Project_1/Readme_images/image2.png)

![Selected Portrait](https://github.com/nmolnar-parsons/major-studio-1/blob/main/Project_1/Readme_images/image3.png)

## Future firections:
- Filtering by date -> add selection bar with two sliders. I don't know what this is called
- selecting topic of interest (maybe outside of original question of viz, which is sitters)
    - occupation
    - gender
    - etc
- smoother animations when opening or closing thumbails
- more elaborate styling?
