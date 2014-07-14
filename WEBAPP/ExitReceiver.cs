using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;

namespace WEBAPP
{
    [BroadcastReceiver]
    public class ExitReceiver : BroadcastReceiver
    {
        public event Action<Context, Intent> Receive;
        public override void OnReceive(Context context, Intent intent)
        {
            if (this.Receive != null)
                this.Receive(context, intent);
        }
    }
}