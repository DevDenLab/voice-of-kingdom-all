import { useRef, useState } from 'react';

/** Returns a copy of `list` with the item at `from` moved to index `to`. */
export function moveItem(list, from, to) {
  const next = [...list];
  next.splice(to, 0, next.splice(from, 1)[0]);
  return next;
}

/**
 * HTML5 drag-and-drop reordering for a list of tiles.
 *
 *   const sort = useDragSort((from, to) => save(moveItem(items, from, to)));
 *   items.map((it, i) => <div key={it.id} {...sort.props(i)} className={sort.over === i ? 'is-over' : ''} />)
 *
 * Only drags that started on one of these tiles are handled, so dropping a file
 * from the desktop onto an upload zone is unaffected.
 */
export function useDragSort(onMove) {
  const dragFrom = useRef(null);
  const [over, setOver] = useState(null);

  const reset = () => {
    dragFrom.current = null;
    setOver(null);
  };

  const props = (index, enabled = true) => ({
    draggable: enabled,
    onDragStart: (e) => {
      if (!enabled) return;
      dragFrom.current = index;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', `sort:${index}`);
    },
    onDragOver: (e) => {
      if (dragFrom.current === null || !enabled) return;
      e.preventDefault();
      if (over !== index) setOver(index);
    },
    onDragLeave: () => setOver((cur) => (cur === index ? null : cur)),
    onDrop: (e) => {
      if (dragFrom.current === null || !enabled) return;
      e.preventDefault();
      const from = dragFrom.current;
      reset();
      if (from !== index) onMove(from, index);
    },
    onDragEnd: reset,
  });

  return { props, over };
}
