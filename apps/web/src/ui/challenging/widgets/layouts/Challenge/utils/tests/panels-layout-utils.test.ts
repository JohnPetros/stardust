import { DEFAULT_PANEL_ORDER, DEFAULT_PANELS_OFFSET } from '../../constants/panel-layout'
import { getDirectionalDropPanelId } from '../getDirectionalDropPanelId'
import { getVisiblePanelOrder } from '../getVisiblePanelOrder'
import { parsePanelsLayoutCookie } from '../parsePanelsLayoutCookie'
import { reorderDockablePanels } from '../reorderDockablePanels'

describe('panels layout utils', () => {
  it('should fallback to default layout when cookie is invalid', () => {
    expect(parsePanelsLayoutCookie('{invalid-json')).toStrictEqual({
      panelOrder: DEFAULT_PANEL_ORDER,
      panelsOffset: DEFAULT_PANELS_OFFSET,
    })
  })

  it('should parse legacy layout order and sizes', () => {
    expect(
      parsePanelsLayoutCookie(
        JSON.stringify({
          panelsLayout: 'tabs-right;code_editor-left',
          tabsPanelSize: 45,
          codeEditorPanelSize: 55,
        }),
      ),
    ).toStrictEqual({
      panelOrder: ['code_editor', 'tabs', 'assistant'],
      panelsOffset: {
        tabsPanelSize: 45,
        codeEditorPanelSize: 55,
        assistantPanelSize: DEFAULT_PANELS_OFFSET.assistantPanelSize,
      },
    })
  })

  it('should reorder panels without duplicating unknown ids', () => {
    expect(
      reorderDockablePanels(['tabs', 'code_editor', 'assistant'], 'assistant', 'tabs'),
    ).toStrictEqual(['assistant', 'tabs', 'code_editor'])
  })

  it('should hide assistant from visible order when disabled', () => {
    expect(
      getVisiblePanelOrder(['assistant', 'code_editor', 'tabs'], false),
    ).toStrictEqual(['code_editor', 'tabs'])
  })

  it('should infer the right neighbor when drag target is unstable', () => {
    expect(getDirectionalDropPanelId(['code_editor', 'tabs'], 'code_editor', 120)).toBe(
      'tabs',
    )
  })

  it('should infer the left neighbor when dragging back to the original side', () => {
    expect(getDirectionalDropPanelId(['code_editor', 'tabs'], 'tabs', -120)).toBe(
      'code_editor',
    )
  })
})
