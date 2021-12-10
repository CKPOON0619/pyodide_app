export const script = `
import matplotlib.pyplot as plt
import io, base64

## Plots only works in non-worker execution
fig, ax = plt.subplots()
ax.plot([1,3,2])

buf = io.BytesIO()
fig.savefig(buf, format='png')
buf.seek(0)

## Internal variables as a port to export all plots to be rendered
__figures = ['data:image/png;base64,' + base64.b64encode(buf.read()).decode('UTF-8')]`;
