# Major Studio 1 Protype 1 - Revolutionary War Portraits

## Data Proccessing
- Downloaded huggingface dataset, queried for any item with "sitter" or "portrait" keywords
- used python to extract sitter names, artist names, put in new columns
- "summary statistics" -> python to count number of portraits per sitter -> CSV export -> json converted
- filtered out "unidentified" sitters when importing json 

## Visualization:

![Prototype_1](https://github.com/nmolnar-parsons/major-studio-1/blob/main/Project_1/Prototype1.png)

## for final submisson:
- filter/summarize data in javascript (not beforehand in python) to retain more information on each portrait
- change chart type to pictoral unit chart:
    - each portrait = 1 square, stack in each bin
    - ideally, put png of each portrait in using thumbnail from dataset
    - tooltip hover over each portrait -> gives portrait artist, date, material/format, collection
- zoom into people with 4-10 portraits?

