# Image

**Epic:** Display
**Component:** Image

---

## Aspect Ratios

### User Story

As a developer consuming Sikat,
I want to render an image in a specific aspect ratio container,
so that images are consistently sized regardless of the source dimensions.

### Acceptance Criteria

- [ ] All 7 `ratio` values enforce the correct aspect ratio: `1:1`, `16:9`, `5:4`, `3:2`, `4:3`, `1:2`, `1:3`
- [ ] The image fills its container without distortion using `object-fit`
- [ ] `portrait={true}` applies a portrait orientation override

### Controls

| Control  | Type    | Options                                                      | Default |
| -------- | ------- | ------------------------------------------------------------ | ------- |
| ratio    | string  | `1:1` \| `16:9` \| `5:4` \| `3:2` \| `4:3` \| `1:2` \| `1:3` | `1:1`   |
| portrait | boolean | `true` \| `false`                                            | `false` |
| alt      | string  | —                                                            | `''`    |

---

## Fit

### User Story

As a developer consuming Sikat,
I want to control how an image fills its aspect-ratio container,
so that I can choose between cropping and letterboxing based on the image content.

### Acceptance Criteria

- [ ] `fit="cover"` (default) crops the image to fill the container
- [ ] `fit="contain"` scales the image to fit within the container, preserving all content

### Controls

| Control | Type   | Options              | Default |
| ------- | ------ | -------------------- | ------- |
| fit     | string | `cover` \| `contain` | `cover` |

---

## Notes

- Extends all native `<img>` HTML attributes.
- Related stories: `07-card`.
