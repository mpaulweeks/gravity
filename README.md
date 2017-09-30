# gravity

misc visualizations using static files

## vibe todo
- fps still weird on slow computers, look into workers?
  - https://johnresig.com/blog/web-workers/
- non-square grids
  - fixed pixel width vs fixed number of rows/cols

## game todo
- dodging game
  - needs avatar for cursor (ship)
    - sprite/gif?
    - draw triangle, always aiming up, angle in at sides?
  - black/white multi-step gradient bg, with rainbow rings
  - keyboard controls, seperate logic/draw threads
    - seperate rbow.step from draw thread? worth a try
  - midi sound effect on ring grab
  - Rotate around center
    - Left/right are satellite, up/down are  radius
    - Avoid triangle slices
    - Triangle slices flash with full blue/green rainbow, then attack with red rainbow effect
- particle game w/ gravity wells
  - VERSUS via local or websockets
    - cooldown on actions
