//
//  WebViewController.m
//  _Note
//
//  COMP 4350 - Software Development 2
//  Group 1: _Note
//

#import "WebViewController.h"

@interface WebViewController ()

@end

@implementation WebViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    //NSString *urlString = @"https://localhost:5000/dropbox-auth-start";
    
    NSString *urlString = @"https://54.201.79.223:5000/dropbox-auth-start";
    NSURL *url = [NSURL URLWithString:urlString];
    
    _urlRequest = [NSURLRequest requestWithURL:url    cachePolicy:NSURLRequestReturnCacheDataElseLoad timeoutInterval:10.0];
    _urlConnection = [[NSURLConnection alloc] initWithRequest:_urlRequest delegate:self startImmediately:YES];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

#pragma mark - NSURLConnection delegate

- (void)connection:(NSURLConnection *)connection didReceiveAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge;
{
    NSLog(@"Connection received authentication challenge.");
    if ([challenge previousFailureCount] == 0)
    {
        _authenticated = YES;
        NSURLCredential *credential = [NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust];
        [challenge.sender useCredential:credential forAuthenticationChallenge:challenge];
    }
    else
    {
        [[challenge sender] cancelAuthenticationChallenge:challenge];
    }
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data {
    NSLog(@"%@", data);
}


- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response;
{
    NSLog(@"Connection received response from server.");
    
    // remake a webview call now that authentication has passed ok.
    _authenticated = YES;
    [_web loadRequest:_urlRequest];
    
    // Cancel the URL connection otherwise we double up (webview + url connection, same url = no good!)
    [_urlConnection cancel];
}

// We use this method is to accept an untrusted site as our server is self signed.
- (BOOL)connection:(NSURLConnection *)connection canAuthenticateAgainstProtectionSpace:(NSURLProtectionSpace *)protectionSpace
{
    return [protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust];
}

#pragma mark - UIWebView delegate
- (void)webViewDidFinishLoad:(UIWebView *)webView {
    
    NSLog(@"HI");
    
}

// Note: This method is particularly important. As the server is using a self signed certificate,
// we cannot use just UIWebView - as it doesn't allow for using self-certs. Instead, we stop the
// request in this method below, create an NSURLConnection (which can allow self-certs via the delegate methods
// which UIWebView does not have), authenticate using NSURLConnection, then use another UIWebView to complete
// the loading and viewing of the page. See connection:didReceiveAuthenticationChallenge to see how this works.
- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType;
{
    NSLog(@"Did start loading: %@ auth:%d", [[request URL] absoluteString], _authenticated);
    
    if (!_authenticated) {
        _authenticated = NO;
        _urlConnection = [[NSURLConnection alloc] initWithRequest:_urlRequest delegate:self];
        [_urlConnection start];
        return NO;
    }
    
    return YES;
}

@end
