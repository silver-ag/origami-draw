# OrigamiDraw

OrigamiDraw is a grid-based svg editor with tools for drawing the lines and arrows useful in origami diagramming.

### Features:
- Lines: valley fold, mountain fold, undifferentiated crease, x-ray visible fold, edge of paper, guide tool to mark horizonally and vertically inline points on other lines
- Arrows: valley fold, mountain fold, mountain and valley folds with immediate unfolds, push arrow, repeat arrow, turn over arrow
- Sides of Paper: polygon fill tool with two default colours for front and back of paper, fill erase
- Grid: points at intersections of lines automatically, add arbitrary points manually, delete points that weren't part of the original grid, basic grid square or isometric when initialising, specify grid density when initialising
- Export: as SVG

### Usage Notes:
- Fill tool works by clicking points to define a polygon. Click a point that's already part of it to finish (typically double click the last point or go back around to the first).
- Your colour choices are preserved when discarding a drawing.
- To avoid drawing lines that are distinct but inseperable by eye, points cannot be arbitrarily close together. This is why the point drawing tool snaps onto the grid.
- Line drawing occassionally misbehaves. Temporarily adding other colinear lines might help make it work if this happens.
- Ensure that index.html and origamidraw.js are in the same folder.
- Tested in firefox.
