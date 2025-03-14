# hat3-fencingsystem
## Version History
### v0.0 (ad9f6ff)
#### Summary
First version with basic operations
#### Changes
- Added window to add fencers to the object.
- Added window to view a list of all fencers in the object.
- Added window to view details of a specific fencer.
- Added window to view all bouts (not yet properly functional).
- Added functionality for moving windows on top of each other.
### v0.0.1 (4869cab)
#### Summary
CSS optimisations
#### Changes
- Changed the way CSS handles colours to variables for easier updating of colours and potential colour scheme options later in development.
- Reduced CSS file size by changing the properties of the container, body, and containerheader elements for every window to be stored as a class instead of repeated code on each ID.
### v0.0.2 (a0386cb)
#### Summary
Changes to appearance of links
#### Changes
- Fencer list links:
  - do not change colour when visited.
  - only have an underline when they are hovered over.
### v0.0.3 (eda3075)
#### Summary
Minor appearance/QoL improvements
#### Changes
- Updated the header to be a separate section with a different background colour.
- Added a logo to the header (currently a placeholder image).
- Cut off overflowing names in the fencer list with an elipsis.
- Added a hover tooltip to the fencer list so that overflowing names can be seen in full.
- Prevented overflowing text in all other windows by allowing text to wrap halfway through words longer than the window width.
- Boldened Fencer Details nametags.
### v0.0.4 (a5eb0e2)
#### Summary
Adds window resizing
#### Changes
- Changed the cursor on window headers to the move cursor.
- Allowed windows to be resized by the user.
- Prevented windows from being resized larger than the screen.
- Added button to reset window size to the default.
- Set initial position of all windows to the top left just below the header.
- Allowed overflowing text within windows to be scrolled.
### v0.0.5 (8fb700c)
#### Summary
Improves the way data is passed between HTML elements and JS functions
#### Changes
- Elements subordinate to windows given data-window property to identify them easily.
- Added a getWindowObjects() function which fetches all the elements attached to a window (container, body, header, button, etc.).
- Added a red close window button to the top right of all windows.
### v0.1.0 (61694e6)
#### Summary
Bout list window made functional and other visual changes
#### Changes
- Added animations for nav buttons.
- Changed colour of nav buttons when toggled via the new 'toggled' class.
- Added default window locations which do not overlap.
- Improved systems to make sure windows don't get stuck off the screen.
- Added function to generate all bout combinations for provided fencers.
- Made the Bout List window functional.
- Added auto-updating functionality to the Bout List.
- Fixed some functions erroneously not updated to new data transfer system released in v0.0.5.
- Added paragraph style for windows with text and buttons.
- Changed colour scheme.
- Added a margin to separate the logo from the nav buttons in the header.
### v0.1.1 (???????)
#### Summary
Bout Details window added
#### Changes
- Added a Bout Details window similar to the Fencer Details window.
- Added a button to toggle the Bout Details window.
- Added links to the Bout List window to access entries in the Bout Details window.