# twitter-polarization

Esse repositório contém o código-fonte para o projeto "Polarização na Política Brasileira: uma abordagem através de visualização de dados", feito pelos alunos
Eduardo Montesuma, Dhanyell Lukas e Guilherme Carvalho na disciplina CK0266 - VISUALIZAÇÃO DE DADOS do curso de Ciência de Computação da Universidade Federal do
Ceará.

## Resumo

O presente trabalho busca explorar através de visualização de dados como os agentes políticos têm se polarizado no espectro político direita-esquerda. Para tanto, exploramos três eixos temáticos,

1. Análise das eleições de 2018
2. Análise das bancadas da câmara dos deputados, por partido e ideologia
3. Análise do comportamento de agentes políticos nas redes sociais

A análise destes tópicos está disponível na [Github Page](https://eddardd.github.io/twitter-polarization/) deste projeto.

## Overview do Repositório

### webapp

Página web desenvolvida com React. É o código-fonte para o nosso Github Page.

### css, js, Figures

Antes do desenvolvimento da página com o React, uma página usando html básico foi desenvolvida (index.html). O código foi mantido por segurança. O código das visualizações, por exmeplo, pode ser encontrado em "./js"

### Data

Vários ".csv" e ".json" usados no desenvolvimento das visualizações.

### Arquivos .ipynb

Notebooks jupyter usados para o pre-processamento dos dados. Em suma, "Preprocessing Data.ipynb" gera os arquivos .json usados no desenvolvimento do Hierarchical Edge Bundling Chart, enquanto "Agrupar Municípios por UF".ipynb agrupa os resultados da votação do 2º turno para presidente em 2018 por unidade da federação.