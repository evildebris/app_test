using System;

using Android.App;
using Android.Content;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Android.OS;
using Android.Webkit;

namespace WEBAPP
{
    [Activity(Label = "值班长IT支持平台", MainLauncher = true, Icon = "@drawable/icon", Theme = "@android:style/Theme.NoTitleBar")]
    public class Activity1 : Activity
    {
        private ExitReceiver exitReceiver;
        private WebView MainWebView;
        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);

            // Set our view from the "main" layout resource
            SetContentView(Resource.Layout.Main);

            // Get our button from the layout resource,
            // and attach an event to it
            MainWebView = FindViewById<WebView>(Resource.Id.webView);
            MainWebView.Settings.JavaScriptEnabled = true;
            MainWebView.Settings.DomStorageEnabled = true;
            MainWebView.LoadUrl("file:///android_asset/LoginUI.html");
            MainWebView.SetWebViewClient(new WebClient());

            exitReceiver = new ExitReceiver();
            exitReceiver.Receive += (Context context, Intent intent) => {
                this.Finish();
            
            };
            
            
        }

        public override bool OnKeyDown(Keycode keyCode, KeyEvent e)
        {
            if(MainWebView==null)
                return base.OnKeyDown(keyCode, e);
            if (keyCode == Keycode.Back && MainWebView.CanGoBack())
            {
                MainWebView.GoBack();
                return true;
            }
            return base.OnKeyDown(keyCode, e);
        }
    }
}

