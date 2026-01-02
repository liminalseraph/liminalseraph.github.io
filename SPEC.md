# Spec: Folder Stack SPA Home

## Summary
A black, minimalist single-page site where white outlined folders are stacked diagonally. Each folder tab is a section link. Hover lifts folders out of the stack. Click launches the folder upward and fades into the target page view. The target view shows a visible page label and a Back button.

## Pages
- Bio
- Projects
- Research
- Blog

## Visual Direction
- Background: pure black (#000).
- Folders: white stroke only, no fill.
- Stack: diagonal offset downward from top-left to bottom-right.
- Tabs: left tab on each folder with the page label.
- Typography: Space Grotesk.
- Page label: visible in PageView, title case (e.g., "Bio").

## Layout
- HomeView: folder stack centered slightly above center to allow diagonal drop.
- Each folder offset by a fixed x/y delta (e.g., +28px, +36px).
- Z-order: top folder highest z-index; each successive folder below.

## Interaction
### Hover (HomeView)
- Lift selected folder outward (translate and slight scale).
- Optional subtle emphasis (glow/shadow) to suggest depth.
- Timing: ~200ms, ease-out.

### Click (HomeView)
- Selected folder launches upward off-screen (translateY(-120vh)).
- Non-selected folders fade to 0.2 opacity.
- Timing: 600–900ms, cubic-bezier(0.22, 1, 0.36, 1).

### Page Transition (SPA)
- After launch animation completes, switch to PageView.
- PageView fades in; HomeView is fully hidden (not visible in background).

### Back
- PageView fades out.
- HomeView reappears with stack reset.

## Motion Accessibility
- Respect prefers-reduced-motion:
  - Replace the folder launch with a quick fade/short translate.
  - Keep transitions minimal.

## Structure (SPA)
- Views: HomeView and PageView.
- State:
  - current = "home" | "bio" | "projects" | "research" | "blog".
- Folder data structure:
  - { label, href, offsetX, offsetY }.

## Components
- Folder component:
  - White outlined folder shape (SVG preferred).
  - Tab label in title case.
  - Hover and launch animation hooks via classes.
- PageView:
  - Label (title case) + Back button.

## Implementation Notes
- Use SVG for crisp folder outlines and scalable tabs.
- Use CSS variables for offsets, timings, and stroke width.
- Use will-change on transform/opacity for smooth animation.

## Open Items
- None.
